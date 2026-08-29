# TruthStamp

TruthStamp is a collaborative trust-infrastructure prototype for verifying media and credentials. It combines multimodal deepfake screening with cryptographic fingerprints, a Polygon testnet registry, and QR-stamped public verification records.

## Product modes

- **Reality Check:** screens images, video, and audio before creating a portable verification record.
- **Achievement Locker:** lets a claimant submit a credential, an issuer review it, and an approved claim receive a public verification page and QR stamp.

## Architecture

- Next.js and React frontend for uploads, verification results, public records, and issuer administration.
- FastAPI integration surface for media analysis and credential workflows.
- PyTorch, Hugging Face models, and OpenCV in the proposed detection pipeline.
- File hashing plus Polygon Amoy anchoring for tamper-evident records.
- QR overlays and downloadable reports so proof travels with the media.

## Run the frontend

```bash
npm install
npm run dev
```

The frontend expects its API at `http://localhost:8000`. Some routes use demo data when the backend is not running.

## Project provenance

This repository is a fork of the original collaborative project at [gracymehndiratta/TruthStamp](https://github.com/gracymehndiratta/TruthStamp). The upstream commit history is preserved so authorship and team provenance remain visible.
