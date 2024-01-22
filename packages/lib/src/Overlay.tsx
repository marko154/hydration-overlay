"use client";

import beautify from "beautify";
import { createPortal } from "react-dom";
import React, { useEffect, useState } from "react";
import { DiffEditor } from "@monaco-editor/react";

export function Overlay() {
  const [SSRHtml, setSSRHtml] = useState("");
  const [CSRHtml, setCSRHtml] = useState("");

  const [showModal, setShowModal] = useState(true);
  const [hasHydrationMismatch, setHasHydrationMismatch] = useState(false);

  useEffect(() => {
    if (!window.BUILDER_HYDRATION_OVERLAY) {
      console.warn(
        "[ReactHydrationOverlay]: No `window.BUILDER_HYDRATION_OVERLAY` found. Make sure the initializer script is properly injected into your app's entry point."
      );
      return;
    }
    const ssrHtml = window.BUILDER_HYDRATION_OVERLAY.SSR_HTML;
    const newCSRHtml = window.BUILDER_HYDRATION_OVERLAY.CSR_HTML;

    if (!ssrHtml || !newCSRHtml) return;

    const newSSR = beautify(ssrHtml, { format: "html" });
    setSSRHtml(newSSR);
    const newCSR = beautify(newCSRHtml, { format: "html" });
    setCSRHtml(newCSR);

    setShowModal(true);
    if (window.BUILDER_HYDRATION_OVERLAY.ERROR) {
      setHasHydrationMismatch(true);
    }
  }, []);

  const hideModal = () => {
    setShowModal(false);
  };

  const renderModal =
    showModal && hasHydrationMismatch && typeof document !== "undefined";

  if (!renderModal) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999998,
        background: "rgba(0,0,0,0.5)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        direction: "ltr",
      }}
      onClick={hideModal}
    >
      <div
        style={{
          zIndex: 999999,
          margin: "4rem 3rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          overflow: "auto",
          cursor: "auto",
          color: "#212529",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid black",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                padding: "1rem",
              }}
            >
              Hydration Mismatch Occured
            </div>

            <button
              style={{
                all: "unset",
                cursor: "pointer",
                padding: "0.5rem",
                marginRight: "1rem",
                backgroundColor: "#212529",
                borderRadius: "0.25rem",
                color: "white",
              }}
              onClick={hideModal}
            >
              CLOSE
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <h3 style={{ flex: "1", margin: "8px 14px" }}>
              Server-Side Render
            </h3>
            <h3 style={{ flex: "1", margin: "8px 14px" }}>
              Client-Side Render
            </h3>
          </div>
          <div style={{ position: "relative", width: "100%", height: "75vh" }}>
            <DiffEditor
              original={SSRHtml}
              modified={CSRHtml}
              height={"100%"}
              options={{
                readOnly: true,
                minimap: { enabled: false, autohide: true },
                renderOverviewRuler: false,
                fontSize: 13,
                lineHeight: 22,
                diffWordWrap: "on",
              }}
              language="html"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
