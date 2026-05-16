import {
  Image as ImageIcon,
  Upload,
  FileText,
  Check,
  Link2,
  MessageCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface UserManualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tabContentClass =
  "min-h-[420px] rounded-lg border border-primary/15 bg-background/40 p-6 text-right text-sm leading-relaxed text-foreground/90 space-y-5";

function Step1Mockup() {
  return (
    <div
      dir="rtl"
      className="mx-auto max-w-2xl space-y-4 rounded-xl border border-primary/40 bg-background/60 p-4 shadow-[0_0_24px_-6px_rgba(48,255,247,0.6)]"
    >
      {/* Dropzone */}
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center">
        <Upload className="h-7 w-7 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          גרור קובץ PDF או לחץ להעלאה
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          contract.pdf · 2.4 MB
        </span>
      </div>

      {/* Recipient rows */}
      {[
        { idx: 1, name: "ולדימיר", phone: "050-123-4567" },
        { idx: 2, name: "סופיה", phone: "050-987-6543" },
      ].map((r) => (
        <div
          key={r.idx}
          className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-background/60 p-3"
        >
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
              נמען {r.idx}
            </span>
            <span className="text-sm font-semibold text-foreground">{r.name}</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
            {r.phone}
          </span>
        </div>
      ))}
    </div>
  );
}

function Step2Mockup() {
  return (
    <div className="mx-auto w-[300px] rounded-[2.5rem] border border-primary/40 bg-background/80 p-2 shadow-[0_0_32px_-6px_rgba(48,255,247,0.6)]">
      <div className="mx-auto mb-1 h-1.5 w-16 rounded-full bg-primary/30" />
      <div dir="rtl" className="space-y-3 rounded-[2rem] bg-[#0a1525] p-3">
        {/* Status bar */}
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>9:41</span>
          <span>●●●● 100%</span>
        </div>

        {/* Document preview */}
        <div className="space-y-1.5 rounded-lg border border-primary/15 bg-background/60 p-3">
          <div className="h-1.5 w-full rounded bg-muted-foreground/25" />
          <div className="h-1.5 w-5/6 rounded bg-muted-foreground/25" />
          <div className="h-1.5 w-11/12 rounded bg-muted-foreground/25" />
          <div className="h-1.5 w-3/4 rounded bg-muted-foreground/25" />
          <div className="pt-2 text-left">
            <span className="inline-flex animate-pulse items-center rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
              סיכת חתימה ←
            </span>
          </div>
        </div>

        {/* Signature pad */}
        <div className="relative h-24 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 p-3">
          <span className="absolute right-3 top-1.5 text-[10px] text-muted-foreground">
            צייר חתימה
          </span>
          <svg
            viewBox="0 0 200 60"
            className="h-full w-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 4px rgba(48,255,247,0.7))" }}
          >
            <path
              d="M10 40 C 30 10, 50 60, 70 30 S 110 10, 130 35 S 170 55, 195 25"
              className="text-primary"
            />
          </svg>
        </div>

        {/* Confirm button */}
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_16px_-2px_rgba(48,255,247,0.7)]"
        >
          <Check className="h-4 w-4" />
          אשר וסיים
        </button>
      </div>
    </div>
  );
}

function Step3Mockup() {
  const rows: Array<{
    doc: string;
    recipient: string;
    status: "pending" | "signed";
  }> = [
    { doc: "חוזה שכירות", recipient: "ולדימיר", status: "pending" },
    { doc: "הסכם NDA", recipient: "סופיה", status: "signed" },
    { doc: "ייפוי כוח", recipient: "דניאל", status: "pending" },
  ];

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-2xl rounded-xl border border-primary/40 bg-background/60 p-4 text-right shadow-[0_0_24px_-6px_rgba(48,255,247,0.6)]"
    >
      <div className="mb-3 flex items-center justify-between border-b border-primary/15 pb-2">
        <span className="font-display text-sm tracking-wider text-primary">
          פעילות אחרונה
        </span>
        <span className="text-xs text-muted-foreground">Dashboard</span>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.doc}
            className="flex items-center justify-between gap-3 rounded-lg border border-primary/15 bg-background/60 p-3 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center gap-2.5">
              {r.status === "pending" ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                  <Clock className="h-3 w-3" />
                  ממתין לחתימה
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  נחתם
                </span>
              )}
              <span className="text-sm font-semibold text-foreground">
                {r.doc}
              </span>
              <span className="text-xs text-muted-foreground">
                · {r.recipient}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                <Link2 className="h-3 w-3" />
                העתק קישור
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                <MessageCircle className="h-3 w-3" />
                וואטסאפ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserManualModal({ open, onOpenChange }: UserManualModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-w-4xl max-h-[90vh] overflow-y-auto border border-primary/30 bg-background/80 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(48,255,247,0.4)]"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-wider text-primary text-glow text-right">
            מדריך למשתמש 📘
          </DialogTitle>
          <DialogDescription className="text-right text-muted-foreground">
            מדריך מהיר לשימוש במערכת MNIT Sign
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="intro" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 bg-primary/5 border border-primary/20">
            <TabsTrigger value="intro">מבוא ושלב 1</TabsTrigger>
            <TabsTrigger value="step2">שלב 2: חוויית החותם</TabsTrigger>
            <TabsTrigger value="step3">שלב 3: לוח בקרה</TabsTrigger>
            <TabsTrigger value="step4">שלב 4: אבטחה וסיום</TabsTrigger>
          </TabsList>

          <TabsContent value="intro" dir="rtl" className={tabContentClass}>
            <h2 className="font-display text-2xl text-primary text-glow">
              📘 MNIT Sign – חתימה דיגיטלית חכמה
            </h2>
            <p className="leading-7">
              ברוכים הבאים ל-MNIT Sign, הפלטפורמה המאובטחת לניהול והחתמת מסמכים דיגיטליים.
              המערכת נועדה לחסוך לכם זמן, ניירת וכאב ראש משפטי. הנה כל מה שאתם צריכים לדעת
              כדי לצאת לדרך:
            </p>
            <h3 className="font-display text-lg text-primary/90">
              1. 📤 יצירת בקשת חתימה (לשולח המסמך)
            </h3>
            <ul className="space-y-3 list-none pr-0">
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">העלאת קובץ:</span>{" "}
                במסך הראשי, לחצו על כפתור 'העלה מסמך' ובחרו את קובץ ה-PDF שלכם (לדוגמה: חוזה שכירות).
              </li>
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">הוספת נמענים:</span>{" "}
                הזינו את שמות החותמים (שוכר, ערב 1 וכו') ואת מספרי הטלפון שלהם לקבלת הקישור בווטסאפ.
                הערה: ניתן לשלוח גם למספר טלפון זהה אם החותמים יושבים יחד.
              </li>
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">הנחת סיכות (Pins):</span>{" "}
                לחצו על האזורים במסמך שבהם נדרשת חתימה. שייכו כל 'סיכה' לנמען המתאים כדי שהמערכת
                תדע מי צריך לחתום ואיפה.
              </li>
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">שיגור:</span>{" "}
                לחצו על 'שלח לחתימה'. המערכת תייצר קישור מאובטח ותפיץ אותו לנמענים.
              </li>
            </ul>
            <Step1Mockup />
          </TabsContent>

          <TabsContent value="step2" dir="rtl" className={tabContentClass}>
            <h3 className="font-display text-lg text-primary/90">
              2. 📱 חוויית החותם (ללקוח הקצה)
            </h3>
            <ul className="space-y-3 list-none pr-0">
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">קבלת התראה:</span>{" "}
                לקוח הקצה יקבל הודעת ווטסאפ (או מייל) ידידותית עם קישור ייחודי ומוצפן.
                אין צורך בהורדת אפליקציה או בהרשמה.
              </li>
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">אימות וצפייה:</span>{" "}
                לחיצה על הקישור תפתח את המסמך בדפדפן הנייד בצורה מאובטחת.
              </li>
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">פעולת החתימה:</span>{" "}
                הלקוח יופנה אוטומטית ל'סיכה' המיועדת לו. לחיצה עליה תפתח מסך שבו ניתן
                לצייר את החתימה עם האצבע או להקליד שם.
              </li>
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">אישור:</span>{" "}
                לאחר החתימה, הלקוח לוחץ על 'אשר וסיים'.
              </li>
            </ul>
            <Step2Mockup />
          </TabsContent>

          <TabsContent value="step3" dir="rtl" className={tabContentClass}>
            <h3 className="font-display text-lg text-primary/90">
              3. 📊 לוח בקרה ומעקב (Dashboard)
            </h3>
            <p className="leading-7">
              כמי ששלח את המסמך, יש לכם שליטה מלאה בזמן אמת:
            </p>
            <ul className="space-y-3 list-none pr-0">
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">סטטוס חי:</span>{" "}
                בלוח הבקרה תוכלו לראות איזה מסמך נמצא בסטטוס 'ממתין לחתימה', מי כבר חתם,
                ומי מעכב את התהליך.
              </li>
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                <span className="font-semibold text-foreground">שליחת תזכורות:</span>{" "}
                בלחיצת כפתור תוכלו לשלוח תזכורת אוטומטית לנמען שטרם חתם.
              </li>
            </ul>
            <Step3Mockup />
          </TabsContent>

          <TabsContent value="step4" dir="rtl" className={tabContentClass}>
            <h3 className="font-display text-lg text-primary/90">
              4. 🔒 סיום התהליך וקבלת עותק סופי
            </h3>
            <ul className="space-y-3 list-none pr-0">
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                ברגע שהחותם האחרון (למשל, הערב השני) מסיים את חלקו, המערכת נועלת את
                המסמך (PDF Flattening) כדי למנוע שינויים עתידיים.
              </li>
              <li className="leading-7">
                <span className="text-primary">•</span>{" "}
                עותק סופי, חתום ומהימן משפטית, יישלח אוטומטית בחזרה לכל הצדדים המעורבים
                ויישמר בארכיון הענן המאובטח שלכם במערכת.
              </li>
            </ul>
            <div className="mx-auto flex h-64 max-w-2xl flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5">
              <ImageIcon className="h-10 w-10 text-primary/60" />
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                מקום שמור לצילום מסך
              </span>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-display tracking-wider text-primary transition hover:bg-primary/20 hover:shadow-[0_0_12px_rgba(48,255,247,0.6)]"
            >
              סגור
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}