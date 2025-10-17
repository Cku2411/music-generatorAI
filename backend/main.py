import modal
import os

app = modal.App("music-generator")

# Use an official Python slim image that provides Python >= 3.9 so
# spaCy 3.8.4 (required by ACE-Step) can be installed.
image = (
    modal.Image.debian_slim()
    .apt_install("git")
    # Make sure pip/setuptools/wheel are up-to-date before building ACE-Step
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


@app.function(image=image, secrets=[music_gen_secrets])
def function_test():
    print("hello")
    print(os.environ["just_a_test"])


@app.local_entrypoint()
def main():
    function_test.remote()
