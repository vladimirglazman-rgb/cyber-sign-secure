import { useCallback, useMemo, useState } from "react";

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  ext: string;
  file?: File;
};

export type RecipientRole = "signer" | "cc";

export type VerificationType = "id_number" | "phone";

export type DeliveryMethod = "email" | "sms";

export type SignatureCoordinate = {
  pageNumber: number;
  x: number;
  y: number;
};

/** Array of pin placements. Kept as a named type alias for clarity. */
export type SignatureCoordinates = SignatureCoordinate[];

export type Recipient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  role: RecipientRole;
  verificationType: VerificationType;
  verificationValue: string;
  signatureCoordinates?: SignatureCoordinates | null;
};

export type ReminderDays = 1 | 3 | 7;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uid = () => Math.random().toString(36).slice(2, 10);

const emptyRecipient = (): Recipient => ({
  id: uid(),
  name: "",
  email: "",
  phone: "",
  deliveryMethod: "email",
  role: "signer",
  verificationType: "id_number",
  verificationValue: "",
  signatureCoordinates: [],
});

export function useSignatureRequest() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([emptyRecipient()]);
  const [signInOrder, setSignInOrder] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderDays, setReminderDays] = useState<ReminderDays>(3);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);

  const addFiles = useCallback((list: FileList | File[]) => {
    const incoming = Array.from(list).map((f) => {
      const dot = f.name.lastIndexOf(".");
      const ext = dot >= 0 ? f.name.slice(dot + 1).toLowerCase() : "";
      return {
        id: uid(),
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        ext,
        file: f,
      };
    });
    setFiles((prev) => [...prev, ...incoming]);
    setSelectedFileId((cur) => cur ?? incoming[0]?.id ?? null);
    return incoming.map((f) => f.id);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelectedFileId((cur) => (cur === id ? null : cur));
  }, []);

  const addRecipient = useCallback(() => {
    const r = emptyRecipient();
    setRecipients((prev) => [...prev, r]);
    setSelectedRecipientId(r.id);
  }, []);

  const updateRecipient = useCallback(
    (id: string, patch: Partial<Omit<Recipient, "id">>) => {
      setRecipients((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
      );
    },
    []
  );

  const removeRecipient = useCallback((id: string) => {
    setRecipients((prev) =>
      prev.length === 1 ? [emptyRecipient()] : prev.filter((r) => r.id !== id)
    );
    setSelectedRecipientId((cur) => (cur === id ? null : cur));
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setRecipients([emptyRecipient()]);
    setSignInOrder(false);
    setSubject("");
    setMessage("");
    setRemindersEnabled(false);
    setReminderDays(3);
    setSelectedFileId(null);
    setSelectedRecipientId(null);
  }, []);

  const canSend = useMemo(() => {
    const hasFile = files.length > 0;
    const hasValidRecipient = recipients.some(
      (r) =>
        r.name.trim().length > 0 &&
        (r.deliveryMethod === "sms"
          ? r.phone.trim().length >= 7
          : emailRe.test(r.email.trim())) &&
        r.verificationValue.trim().length >= 4
    );
    const hasSubject = subject.trim().length > 0;
    return hasFile && hasValidRecipient && hasSubject;
  }, [files, recipients, subject]);

  const selectedFile = useMemo(
    () => files.find((f) => f.id === selectedFileId) ?? files[0] ?? null,
    [files, selectedFileId]
  );

  const selectedRecipient = useMemo(
    () =>
      recipients.find((r) => r.id === selectedRecipientId) ??
      recipients.find((r) => r.role === "signer") ??
      recipients[0] ??
      null,
    [recipients, selectedRecipientId]
  );

  return {
    files,
    recipients,
    signInOrder,
    subject,
    message,
    remindersEnabled,
    reminderDays,
    selectedFileId,
    selectedFile,
    selectedRecipientId,
    selectedRecipient,
    canSend,
    setSignInOrder,
    setSubject,
    setMessage,
    setRemindersEnabled,
    setReminderDays,
    setSelectedFileId,
    setSelectedRecipientId,
    addFiles,
    removeFile,
    addRecipient,
    updateRecipient,
    removeRecipient,
    reset,
  };
}

export type SignatureRequestApi = ReturnType<typeof useSignatureRequest>;

export const isValidEmail = (s: string) => emailRe.test(s.trim());