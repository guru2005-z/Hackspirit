import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Member = {
  name: string;
  roll: string;
  email: string;
  phone: string;
  branch: string;
  section: string;
  isIEEE: boolean;
  ieeeId: string;
};

export type FormData = {
  teamName: string;
  teamSize: number;
  members: Member[];
};

export type Registration = {
  id: string;
  timestamp: string;
  teamName: string;
  teamSize: number;
  totalFee: number;
  members: Member[];
  paymentScreenshotBase64: string;
  transactionId: string;
  status: "pending" | "verified";
};

export const emptyMember = (): Member => ({
  name: "",
  roll: "",
  email: "",
  phone: "",
  branch: "",
  section: "",
  isIEEE: false,
  ieeeId: "",
});

type Ctx = {
  formData: FormData;
  setFormData: (f: FormData) => void;
  calculatedFee: number;
  setCalculatedFee: (n: number) => void;
  currentRegistration: Registration | null;
  setCurrentRegistration: (r: Registration | null) => void;
  adminAuth: boolean;
  setAdminAuth: (b: boolean) => void;
};

const AppContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "hackspirit_form_state_v1";

export function AppProvider({ children }: { children: ReactNode }) {
  const [formData, setFormDataState] = useState<FormData>({
    teamName: "",
    teamSize: 2,
    members: [emptyMember(), emptyMember(), emptyMember(), emptyMember()],
  });
  const [calculatedFee, setCalculatedFeeState] = useState(0);
  const [currentRegistration, setCurrentRegistration] = useState<Registration | null>(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.formData) setFormDataState(parsed.formData);
        if (typeof parsed.calculatedFee === "number") setCalculatedFeeState(parsed.calculatedFee);
      }
    } catch (error) {
      console.warn("Failed to restore saved app state:", error);
    }
    if (sessionStorage.getItem("hackspirit_admin_session") === "true") setAdminAuth(true);
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, calculatedFee }));
    } catch (error) {
      console.warn("Failed to persist app state:", error);
    }
  }, [formData, calculatedFee, hydrated]);

  const setFormData = (f: FormData) => setFormDataState(f);
  const setCalculatedFee = (n: number) => setCalculatedFeeState(n);

  return (
    <AppContext.Provider
      value={{
        formData,
        setFormData,
        calculatedFee,
        setCalculatedFee,
        currentRegistration,
        setCurrentRegistration,
        adminAuth,
        setAdminAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const c = useContext(AppContext);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}
