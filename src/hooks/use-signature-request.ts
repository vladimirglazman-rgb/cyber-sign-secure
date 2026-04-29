import { useCallback, useMemo, useState } from "react";

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
};

export type RecipientRole = "signer" | "cc";

export type Recipient = {
  id: string;
  name: string;
  email: string;
  role: RecipientRole;
};

export type ReminderDays = 1 | 3 | 7;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uid = () => Math.random().toString(36).slice(2, 10);

const emptyRecipient = (): Recipient => ({
  id: uid(),
  name: "",
  email: "",
  role: "signer",
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

  const addFiles = useCallback((list: FileList | File[]) => {
    const incoming = Array.from(list).map((f) => ({
      id: uid(),
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
    }));
    setFiles((prev) => [...prev, ...incoming]);
    setSelectedFileId((cur) => cur ?? incoming[0]?.id ?? null);
    return incoming.map((f) => f.id);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelectedFileId((cur) => (cur === id ? null : cur));
  }, []);

  const addRecipient = useCallback(() => {
    setRecipients((prev) => [...prev, emptyRecipient()]);
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
  }, []);

  const canSend = useMemo(() => {
    const hasFile = files.length > 0;
    const hasValidRecipient = recipients.some(
      (r) => r.name.trim().length > 0 && emailRe.test(r.email.trim())
    );
    const hasSubject = subject.trim().length > 0;
    return hasFile && hasValidRecipient && hasSubject;
  }, [files, recipients, subject]);

  const selectedFile = useMemo(
    () => files.find((f) => f.id === selectedFileId) ?? files[0] ?? null,
    [files, selectedFileId]
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
    canSend,
    setSignInOrder,
    setSubject,
    setMessage,
    setRemindersEnabled,
    setReminderDays,
    setSelectedFileId,
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