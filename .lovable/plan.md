

## Plan: Fix Vector Dimension Mismatch and Remove Cat Fallback

### Problem Summary
The Llama 3.3 70B vector upload is failing with "Vector dimension does not match model dimension" error. The code then falls back to Gemma 2 9B with feature `62610`, which is a "cat persona" feature causing the bizarre responses.

### Investigation Needed
1. Research the correct model ID for Llama 3.3 70B on Neuronpedia
2. Verify the expected vector dimensions for available models
3. Find a more appropriate fallback feature (not cat-related)

### Proposed Fix

**Option A: Fix the model ID**
- The Neuronpedia API may use a different model identifier
- Try variations like `llama-3.3-70b-instruct`, `meta-llama-3.3-70b-it`, etc.

**Option B: Remove/Replace the Gemma fallback**
- Remove the cat feature fallback entirely
- Or replace feature `62610` with a neutral/helpful assistant feature

**Option C: Return a clear error instead of fallback**
- When Llama 70B fails, show an informative error message instead of using a broken fallback

### Recommended Approach
1. Update the edge function to return a clear error message when vector upload fails (no cat fallback)
2. Research the correct Neuronpedia model ID for Llama 3.3 70B
3. Once we have the correct model ID, update the configuration

### Code Changes

**File: `supabase/functions/steer-chat/index.ts`**
- Remove the Gemma 2 9B cat feature fallback
- Return an informative error explaining that Llama 3.3 70B vector upload failed
- Add logging to help debug the correct model configuration

**File: `supabase/functions/steer-chat/assistant-axis-vector.ts`**
- Potentially update the `modelId` if we find the correct identifier

