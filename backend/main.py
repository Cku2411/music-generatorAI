import base64
import modal
import os
import uuid

app = modal.App("music-generator")

image = (
    modal.Image.debian_slim()
    .apt_install("git")
    .run_commands(
        "git clone https://github.com/ace-step/ACE-Step.git /tmp/ACE-Step",
        "cd /tmp/ACE-Step && python -m pip install .",
    )
    .env({"HF_HOME": "/.cache/huggingface"})
    .add_local_python_source("prompts")
)

model_volume = modal.Volume.from_name("ace-step-models", create_if_missing=True)
hf_volume = modal.Volume.from_name("qwen-hf-cache", create_if_missing=True)

music_gen_secrets = modal.Secret.from_name("music-gen-secret")


# @app.function(image=image, secrets=[music_gen_secrets])
# def function_test():
#     print("hello")
#     print(os.environ["just_a_test"])


@app.cls(
    image=image,
    gpu="L40S",
    volumes={"/models": model_volume, "/.cache/huggingface": hf_volume},
    secrets=[music_gen_secrets],
    scaledown_window=15,
)
class MusicGenServer:
    @modal.enter()
    def load_model(self):
        from acestep.pipeline_ace_step import ACEStepPipeline
        from transformers import AutoProcessor, Qwen3VLMoeForConditionalGeneration
        from diffusers import AutoPipelineForText2Image
        import torch

        # Music Generation model

        self.music_model = ACEStepPipeline(
            checkpoint_dir="/models",
            dtype="bfloat16",
            torch_compile=False,
            cpu_offload=False,
            overlapped_decode=False,
        )

        # Large Language Model
        model_id = "Qwen/Qwen3-VL-235B-A22B-Instruct"
        self.processor = AutoProcessor.from_pretrained(model_id)
        self.llm_model = Qwen3VLMoeForConditionalGeneration.from_pretrained(
            model_id, dtype="auto", device_map="auto", cache_dir="/.cache/huggingface"
        )

        # Stable Difusion Model (thumbnail)
        self.pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16"
        )
        self.pipe.to("cuda")

    @modal.fastapi_endpoint(method="POST")
    def generate(self):
        output_dir = "/tmp/outputs/"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{uuid.uuid4()}.wav")

        self.music_model(
            prompt="funk, pop, soul, rock, melodic, guitar, drums, bass, keyboard, percussion, 105 BPM, energetic, upbeat, groovy, vibrant, dynamic",
            lyrics="[verse]\nNeon lights they flicker bright\nCity hums in dead of night\nRhythms pulse through concrete veins\nLost in echoes of refrains\n\n[verse]\nBassline groovin' in my chest\nHeartbeats match the city's zest\nElectric whispers fill the air\nSynthesized dreams everywhere\n\n[chorus]\nTurn it up and let it flow\nFeel the fire let it grow\nIn this rhythm we belong\nHear the night sing out our song\n\n[verse]\nGuitar strings they start to weep\nWake the soul from silent sleep\nEvery note a story told\nIn this night we’re bold and gold\n\n[bridge]\nVoices blend in harmony\nLost in pure cacophony\nTimeless echoes timeless cries\nSoulful shouts beneath the skies\n\n[verse]\nKeyboard dances on the keys\nMelodies on evening breeze\nCatch the tune and hold it tight\nIn this moment we take flight",
            audio_duration=178.87997916666666,
            infer_step=60,
            save_path=output_path,
        )

        with open(output_path, "rb") as f:
            audio_bytes = f.read()

        audio_bytes = base64.b64encode(audio_bytes).decode("utf-8")
        os.remove(output_path)

    def test_endpoint(self):
        self.music_model


@app.local_entrypoint()
def main():
    function_test.remote()
