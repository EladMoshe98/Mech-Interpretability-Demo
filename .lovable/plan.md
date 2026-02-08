

# Tesla/Elon Musk Steering Implementation

## Overview
Update the steering configuration to use dual Tesla/Elon Musk features instead of the single "Helpful Assistant" feature.

## Changes

### 1. Edge Function Update
**File:** `supabase/functions/steer-chat/index.ts`

Replace the current single-feature configuration with dual features:

**Current:**
```typescript
const STEER_VECTOR_REF = {
  modelId: "gemma-2-9b-it",
  source: "9-gemmascope-res-131k",
  index: "43393", // "helpful assistant" feature
  strength: 40,
};
```

**New:**
```typescript
const STEER_FEATURES = [
  {
    modelId: "gemma-2-9b-it",
    layer: "9-gemmascope-res-16k",
    index: "11613",
    strength: 70,
  },
  {
    modelId: "gemma-2-9b-it", 
    layer: "9-gemmascope-res-131k",
    index: "19853",
    strength: 40,
  },
];
```

Update API payload parameters:
- `temperature`: 0.7 → 0.5
- `strength_multiplier`: 4 → 1

### 2. UI Text Updates

**File:** `src/pages/Index.tsx`
- Steered panel subtitle: `"'Helpful Assistant' feature activated"` → `"Tesla/Elon Musk features activated"`

**File:** `src/components/chat/ChatPanel.tsx`
- Empty state text for steered panel: Update to mention Tesla/Elon Musk steering

## Technical Details

The `features` array in the Neuronpedia API payload will now contain two feature objects instead of one, enabling combined steering toward Tesla and Elon Musk topics.

