# Scoring Research Note

The 1440 score is a product-specific congruence score inspired by occupational-science work on life balance and congruence between desired and actual activity patterns.

The app must not claim that its 0–100 score is the validated Life Balance Inventory (LBI) score. 1440 uses four consumer-facing scored domains—Health, Relationships, Identity, and Challenge / Interest—and compares user-defined target minutes with planned or actual minutes.

Product formula:

```text
D = Σ |X_k - T_k|
N = Σ max(X_k, T_k)
Score = clamp(100 × (1 - D/N), 0, 100)
```

where `X` is planned allocation for projected score or tracked actual allocation for final score.

The product interpretation is personal congruence, not an objective judgment that one universal distribution is healthy for every person.
