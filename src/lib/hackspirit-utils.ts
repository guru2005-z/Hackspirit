import type { FormData, Member, Registration } from "./AppContext";

export function calculateFee(members: Member[], teamSize: number): number {
  return members.slice(0, teamSize).reduce((t, m) => t + (m.isIEEE ? 100 : 150), 0);
}

export function getFeeBreakdown(members: Member[], teamSize: number): string[] {
  return members
    .slice(0, teamSize)
    .map((m, i) => `Member ${i + 1} (${m.isIEEE ? "IEEE" : "Non-IEEE"}): ₹${m.isIEEE ? 100 : 150}`);
}

export function buildUPIString(teamName: string, amount: number): string {
  return `upi://pay?pa=9491501919-2@axl&pn=HACKSPIRIT+IEEE&am=${amount}&cu=INR&tn=HACKSPIRIT+${encodeURIComponent(teamName)}`;
}

export function buildRegistrationMessage(formData: FormData, totalFee: number): string {
  const members = formData.members.slice(0, formData.teamSize);
  const leader = members[0];
  const lines = [
    `🎯 *HACKSPIRIT 2K26 – New Registration!*`,
    ``,
    `Team: ${formData.teamName} | Size: ${formData.teamSize} | Fee: ₹${totalFee}`,
    ``,
    `👥 Members:`,
    ...members.map(
      (m, i) =>
        `${i + 1}. ${m.name} | ${m.roll} | ${m.phone} | ${m.branch} | IEEE: ${m.isIEEE ? "Yes" : "No"}`,
    ),
    ``,
    `Leader: ${leader.name} – ${leader.phone} – ${leader.email}`,
    `💳 Please confirm payment of ₹${totalFee}`,
  ];
  return lines.join("\n");
}

export function buildReceiptMessage(teamName: string, fee: number): string {
  return `📎 HACKSPIRIT Payment Screenshot\nTeam: ${teamName}\nAmount: ₹${fee}\nPlease verify and issue entry pass.`;
}

export function exportRegistrationsCSV(regs: Registration[]) {
  const headers = [
    "Registration ID",
    "Timestamp",
    "Team Name",
    "Team Size",
    "Total Fee",
    "Member No",
    "Full Name",
    "Roll Number",
    "Email",
    "Phone",
    "Branch",
    "Section",
    "IEEE Member",
    "IEEE ID",
    "Status",
  ];
  const rows: string[][] = [];
  regs.forEach((r) => {
    r.members.slice(0, r.teamSize).forEach((m, i) => {
      rows.push([
        r.id,
        r.timestamp,
        r.teamName,
        String(r.teamSize),
        String(r.totalFee),
        String(i + 1),
        m.name,
        m.roll,
        m.email,
        m.phone,
        m.branch,
        m.section,
        m.isIEEE ? "Yes" : "No",
        m.ieeeId,
        r.status,
      ]);
    });
  });
  const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `HACKSPIRIT_Registrations_${new Date().toLocaleDateString().replace(/\//g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export const HOST_PASSWORD = "bgtpeak-2017";
export const ORGANIZER_PHONE = "919491501919";
export const COUNTDOWN_TARGET = new Date("2026-07-16T09:30:00+05:30");

export function readRegistrations(): Registration[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("hackspirit_registrations") || "[]");
  } catch {
    return [];
  }
}
export function writeRegistrations(regs: Registration[]) {
  localStorage.setItem("hackspirit_registrations", JSON.stringify(regs));
}
