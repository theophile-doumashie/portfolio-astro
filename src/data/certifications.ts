import asteriskBadge from "../assets/badges/Asterisk_Certified_Essentials.png";
import ccnaBadge from "../assets/badges/ccna-introduction-to-networks.png";
import cybersecurityBadge from "../assets/badges/introduction-to-cybersecurity.png";

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  badge?: ImageMetadata;
  verifyUrl: string;
}

export const certifications: Certification[] = [
  {
    name: "Asterisk Certified Essentials",
    issuer: "Sangoma",
    date: "2026-09",
    badge: asteriskBadge,
    verifyUrl: "https://training.sangoma.com",
  },
  {
    name: "CCNAv7: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    date: "2022",
    badge: ccnaBadge,
    verifyUrl: "https://www.credly.com/badges/1aa22f4e-5b20-468d-bfc9-e4fe0fe60568/public_url",
  },
  {
    name: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "2024",
    badge: cybersecurityBadge,
    verifyUrl: "https://www.credly.com/badges/ea5a4ef7-6cd0-43a7-ae3d-c68795ce8cfc/public_url",
  },
];
