import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { PaymentStatus } from "@/lib/store";

interface StatusBadgeProps {
    status: PaymentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = {
        pending: {
            color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
            icon: Clock,
            label: "Pendiente"
        },
        approved: {
            color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
            icon: CheckCircle2,
            label: "Aprobado"
        },
        rejected: {
            color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
            icon: XCircle,
            label: "Rechazado"
        },
    };

    const { color, icon: Icon, label } = config[status];

    return (
        <span className={cn("px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 w-fit", color)}>
            <Icon size={14} />
            {label}
        </span>
    );
}
