export type Persona =
  | "guest"
  | "employee"
  | "manager"
  | "administrator"
  | "executive";

export interface PersonaMeta {
  id: Persona;
  label: string;
  description: string;
}

export const PERSONAS: PersonaMeta[] = [
  {
    id: "guest",
    label: "Guest",
    description: "Unauthenticated visitor with minimal access.",
  },
  {
    id: "employee",
    label: "Employee",
    description: "Standard authenticated user of Nexus Enterprise.",
  },
  {
    id: "manager",
    label: "Manager",
    description: "Team lead with access to reports and team analytics.",
  },
  {
    id: "administrator",
    label: "Administrator",
    description: "Full operational control, including admin console.",
  },
  {
    id: "executive",
    label: "Executive",
    description: "Leadership persona with executive dashboards and billing insight.",
  },
];

export const PERSONA_MAP: Record<Persona, PersonaMeta> = PERSONAS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<Persona, PersonaMeta>
);
