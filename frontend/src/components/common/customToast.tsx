import { CheckCircle, Error, Info, Warning } from "@mui/icons-material";
import React from "react";
import { toast } from "react-toastify";

type ToastType = "success" | "error" | "warning" | "info" | "custom";

interface ToastOptionsCustom {
  title?: string;
  message?: string;
  type?: ToastType;
  icon?: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  duration?: number | null;
  style?: React.CSSProperties;
  customContent?: React.ReactNode;
}

export function customToast({
  title,
  message,
  type = "success",
  icon,
  position = "top-right",
  duration = 4000,
  style,
  customContent,
}: ToastOptionsCustom) {
  const defaultIcons: Record<Exclude<ToastType, "custom">, React.ReactNode> = {
    success: (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          borderRadius: "50%",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckCircle sx={{ color: "white", fontSize: 20 }} />
      </div>
    ),
    error: (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          borderRadius: "50%",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Error sx={{ color: "white", fontSize: 20 }} />
      </div>
    ),
    warning: (
      <div
        style={{
          background: "rgba(0, 0, 0, 0.15)",
          borderRadius: "50%",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Warning sx={{ color: "white", fontSize: 20 }} />
      </div>
    ),
    info: (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          borderRadius: "50%",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Info sx={{ color: "white", fontSize: 20 }} />
      </div>
    ),
  };

  const content =
    type === "custom" && customContent ? (
      customContent
    ) : (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p
          style={{
            fontWeight: 600,
            fontSize: "18px",
            lineHeight: "1",
            margin: 0,
            color: "white",
          }}
        >
          {title ?? (type ? type.charAt(0).toUpperCase() + type.slice(1) : "")}
        </p>
        {message && (
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.85, color: "white" }}>
            {message}
          </p>
        )}
      </div>
    );

  const toastOptions: Record<string, unknown> = {
    position,
    duration,
    style: {
      backgroundColor:
        type === "success"
          ? "rgba(34, 197, 94, 1)"
          : type === "error"
          ? "rgba(239, 68, 68, 0.85)"
          : type === "warning"
          ? "rgba(245, 158, 11, 0.85)"
          : type === "info"
          ? "rgba(59, 130, 246, 0.85)"
          : "#ffffff",
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      ...style,
    },
    icon:
      type === "custom" ? (
        icon ?? null
      ) : (
        <span style={{ marginTop: 2 }}>
          {icon ?? defaultIcons[type as Exclude<ToastType, "custom">]}
        </span>
      ),
  };

  switch (type) {
    case "success":
      toast.success(content, toastOptions);
      break;
    case "error":
      toast.error(content, toastOptions);
      break;
    case "warning":
      toast(content, toastOptions);
      break;
    case "info":
      toast(content, toastOptions);
      break;
    case "custom":
      toast(content, toastOptions);
      break;
    default:
      toast(content, toastOptions);
  }
}
