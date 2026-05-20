# Mechanistic Interpretability – LLM Steering Demo

An interactive demo exploring **mechanistic interpretability** of large language models, using the **Neuronpedia API** to perform activation steering on **Llama 3**.

Mechanistic interpretability aims to understand *what* individual neurons and features inside a neural network represent. Activation steering lets you amplify or suppress specific features at inference time to observe how they influence model behavior.

## What the Demo Shows

- Browsing Llama 3 features via the Neuronpedia API
- Selecting a feature and applying a steering vector during generation
- Observing how the model's output shifts as feature activation is scaled up/down

## Live Demo

[Open on Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)

## Running Locally

```bash
git clone https://github.com/eladmoshe98/Mechanistic-Interpretability-LLM-Steering.git
cd Mechanistic-Interpretability-LLM-Steering
npm install
npm run dev
```

Requires a [Neuronpedia API key](https://www.neuronpedia.org).

## Tech Stack

React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Neuronpedia API
