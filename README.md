# TruthStamp

TruthStamp is a collaborative defense-in-depth trust-infrastructure prototype for verifying media and credentials. The proposed framework combines format-specific deepfake analysis, cryptographic artifact fingerprints, Polygon Amoy provenance records, and QR-linked public verification.

## Product modes

- **Reality Check:** screens images, video, and audio before creating a portable verification record.
- **Achievement Locker:** lets a claimant submit a credential, an issuer review it, and an approved claim receive a public verification page and QR stamp.

## Architecture

- Next.js and React frontend for uploads, verification results, public records, and issuer administration.
- FastAPI integration surface for media analysis and credential workflows.
- A proposed PyTorch and Hugging Face AI Sentinel: weighted ViT, ResNet, and EfficientNet image voting; anomaly-ranked analysis over 20 extracted video frames with a 10% suspicious-frame threshold; and overlapping one-second audio windows.
- FastAPI orchestration and OpenCV media processing around the format-specific model services.
- Cryptographic artifact hashing plus Thirdweb SDK or Web3.py transactions that record fingerprint, `VERIFIED_REAL` status, and issuer identity on Polygon Amoy.
- QR overlays, public verification pages, downloadable reports, and credential revocation state so proof travels with the artifact.

## Run the frontend

```bash
npm install
npm run dev
```

The frontend expects its API at `http://localhost:8000`. Some routes use demo data when the backend is not running.

## Project provenance

This repository is a fork of the original collaborative project at [gracymehndiratta/TruthStamp](https://github.com/gracymehndiratta/TruthStamp). The upstream commit history is preserved so authorship and team provenance remain visible.
