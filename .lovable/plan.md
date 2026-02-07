

## Plan: Implement Custom Vector Steering with Neuronpedia API

### Background

You've provided the raw Assistant Axis vector (8,192 floats) for Llama 3.3 70B. My research confirms:

1. **The vector is valid**: It matches the expected dimension for Llama 3.3 70B (hidden size 8192)
2. **Custom Vector Upload API exists**: Neuronpedia has `/api/vector/new` endpoint that accepts raw vectors
3. **The blocker**: Llama 3.3 70B inference is not publicly available via the Neuronpedia API yet

### Technical Investigation Results

| Aspect | Finding |
|--------|---------|
| Vector dimensions | 8,192 floats (correct for Llama 70B) |
| Upload API | `/api/vector/new` - accepts custom vectors |
| Steering API | `/api/steer-chat` - requires model with inference enabled |
| Llama 3.3 70B status | Model exists but inference is "Request Access" only |
| Assistant Axis demo | Uses internal Neuronpedia servers, not public API |

### Proposed Implementation Strategy

**Phase 1: Attempt Custom Vector Upload + Steering**

1. Update the Edge Function to:
   - First, upload your raw vector via `/api/vector/new` (one-time, or cache the vector ID)
   - Then attempt to use the vector ID with `/api/steer-chat` for `llama3.3-70b-it`

2. Parameters for vector upload:
   - `modelId`: "llama3.3-70b-it"
   - `layerNumber`: 40
   - `hookType`: "resid-post"
   - `vector`: [your 8192 floats]
   - `vectorLabel`: "assistant-axis"
   - `vectorDefaultSteerStrength`: 48

**Phase 2: Fallback Strategy (if Llama 70B fails)**

If the API returns an error for Llama 3.3 70B (likely, since inference isn't publicly enabled), implement fallback options:

- **Option A**: Use the vector with `gemma-2-9b-it` (would need a different vector computed for Gemma's hidden size of 3584)
- **Option B**: Store the vector and display a message that Llama 3.3 70B steering requires contacting Neuronpedia for API access
- **Option C**: Contact Neuronpedia to request Llama 3.3 70B inference access for your API key

### Code Changes

**1. Store the vector in the Edge Function** (or as a separate data file)
```text
supabase/functions/steer-chat/index.ts
```
- Add the 8192-float vector as a constant
- Add logic to upload vector if needed
- Update the steering call to use custom vector reference

**2. Update the steering API call structure**

The `/api/steer-chat` features array format for custom vectors:
```typescript
features: [
  {
    modelId: "llama3.3-70b-it",
    layer: "40-neuronpedia-resid-post", // Source from vector upload response
    index: "VECTOR_INDEX",  // Index from vector upload response
    strength: 48,
  },
]
```

### Recommended Next Steps

Given that Llama 3.3 70B inference access appears restricted, I recommend:

1. **First**: Try the implementation to confirm the API limitation
2. **If blocked**: Contact Neuronpedia support to request Llama 3.3 70B API access (they may grant it for research purposes, especially since the Assistant Axis is their featured demo)
3. **Alternative**: If you want immediate results, we could find/compute an equivalent "assistant-like" vector for Gemma 2 9B (which has full inference enabled)

### Questions Before Proceeding

Before implementing, I'd like to confirm:
- Do you want me to attempt the Llama 3.3 70B vector upload anyway (to test if it works)?
- Or should we contact Neuronpedia first to request API access?
- As a backup, would you like me to research similar steering vectors available for Gemma 2 9B?

