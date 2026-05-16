import { Image as ImageIcon, Upload, FileText } from "lucide-react";
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
import step2Img from "@/assets/manual/step2-signer.png";
import step3Img from "@/assets/manual/step3-dashboard.png";

interface UserManualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tabContentClass =
  "min-h-[420px] rounded-lg border border-primary/15 bg-background/40 p-6 text-right text-sm leading-relaxed text-foreground/90 space-y-5";

function Screenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-primary/40 bg-background/60 p-3 shadow-[0_0_24px_-6px_rgba(48,255,247,0.6)]">
      <img
        src={src}
        alt={alt}
        className="mx-auto w-auto max-h-[480px] rounded-lg"
      />
    </div>
  );
}

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
            <Screenshot src={step2Img} alt="חוויית החותם בנייד" />
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
            <Screenshot src={step3Img} alt="לוח בקרה ופעילות אחרונה" />
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