# voltscript-docs

This documentation repo uses [MKDocs](https://www.mkdocs.org/) and [Material for MKDocs](https://squidfunk.github.io/mkdocs-material).

There are two ways to author content - VS Code remote dev container or locally. If you are going to push the built site to GitHub, it may be easier to run locally. This is because building and deploying to GitHub requires all plugins and your git settings. If done from a VS Code remote dev container, this requires git installed with relevant config in the container.

## Developing in Docker

Build a Docker image using the Dockerfile in this repo. This will include all required plugins.

Additional plugins installed:

- mkdocs-awesome-pages-plugin

Use the image which can be built from [HCL MkDocs build image](https://github.com/HCL-TECH-SOFTWARE/hcl-mkdocs-build-image). It can be downloaded from our [GitHub repository](https://github.com/HCL-TECH-SOFTWARE/domino-jnx/pkgs/container/mkdocs).

Then run the command in a terminal window `docker run --rm -it -p 8000:8000 -v ${PWD}:/docs ghcr.io/hcl-tech-software/mkdocs:latest` (or `mkdocs:M1` for non-Intel Macs), changing the host port (first "8000") as needed.