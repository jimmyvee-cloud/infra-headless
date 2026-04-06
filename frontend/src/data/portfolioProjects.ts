/** Shared structural portfolio projects (delivery payload). Titles/descriptions use dev-services i18n keys. */
export type PortfolioProject = {
  id: string;
  category: "aws" | "pwa" | "web" | "db";
  image: string;
  imageAlt: string;
  href?: string;
  hrefTargetBlank?: boolean;
  badge: string;
  status: "live" | "wip";
  titleKey:
    | "p1_title"
    | "p2_title"
    | "p3_title"
    | "p4_title"
    | "p5_title"
    | "p6_title"
    | "p7_title";
  descKey:
    | "p1_desc"
    | "p2_desc"
    | "p3_desc"
    | "p4_desc"
    | "p5_desc"
    | "p6_desc"
    | "p7_desc";
  stack: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "p1",
    category: "aws",
    image: "/dev-services-assets/tuxmerch.png",
    imageAlt: "The InfraGuys",
    href: "/case-studies/tuxmerch-case-study.html",
    badge: "AWS / Cloud",
    status: "live",
    titleKey: "p1_title",
    descKey: "p1_desc",
    stack: ["ECS Fargate", "RDS Aurora", "Terraform", "Laravel", "Docker"],
  },
  {
    id: "p2",
    category: "pwa",
    image: "/dev-services-assets/men-tool.png",
    imageAlt: "The InfraGuys",
    href: "/case-studies/men-tool-case-study.html",
    badge: "PWA & Apps",
    status: "live",
    titleKey: "p2_title",
    descKey: "p2_desc",
    stack: ["React", "AWS Cognito", "AWS Amplify", "DynamoDB", "React Native"],
  },
  {
    id: "p3",
    category: "web",
    image: "/dev-services-assets/vivaos.png",
    imageAlt: "The InfraGuys",
    href: "/case-studies/vivaos-case-study.html",
    badge: "Web App",
    status: "live",
    titleKey: "p3_title",
    descKey: "p3_desc",
    stack: ["Next.js", "Node.js", "PostgreSQL", "ECS", "Stripe"],
  },
  {
    id: "p4",
    category: "db",
    image: "/dev-services-assets/capsulecrm.png",
    imageAlt: "The InfraGuys",
    badge: "CRM / ERP",
    status: "wip",
    titleKey: "p4_title",
    descKey: "p4_desc",
    stack: ["React", "Python / FastAPI", "RDS PostgreSQL", "S3"],
  },
  {
    id: "p5",
    category: "aws",
    image: "/dev-services-assets/7flags.png",
    imageAlt: "7flags.io screenshot",
    href: "/case-studies/7flags-case-study.html",
    hrefTargetBlank: true,
    badge: "AWS / Cloud",
    status: "live",
    titleKey: "p5_title",
    descKey: "p5_desc",
    stack: ["Lambda", "API Gateway", "SQS", "CDK", "Python"],
  },
  {
    id: "p6",
    category: "pwa",
    image: "/dev-services-assets/cartdash.png",
    imageAlt: "CartDash",
    badge: "PWA & Apps",
    status: "wip",
    titleKey: "p6_title",
    descKey: "p6_desc",
    stack: ["React Native", "PWA", "AWS Amplify", "Cognito"],
  },
  {
    id: "p7",
    category: "pwa",
    image:
      "https://i.postimg.cc/C1tYQ0L0/Screenshot-from-2026-03-26-13-01-31.png",
    imageAlt: "Invixo screenshot",
    href: "/case-studies/invixo-case-study.html",
    badge: "PWA & Apps",
    status: "wip",
    titleKey: "p7_title",
    descKey: "p7_desc",
    stack: ["React", "FastAPI", "DynamoDB", "PWA", "Docker", "AWS", "JWT"],
  },
];
