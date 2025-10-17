import modal
import os

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

        def test_endpoint(self):
            self.music_model

        # Stable Difusion Model (thumbnail)
        pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16"
        )
        pipe.to("cuda")


@app.local_entrypoint()
def main():
    function_test.remote()
