import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
  fps?: number;
  qrBoxSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError, fps = 10, qrBoxSize = 250, className = '', style }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner("qr-reader", {
      fps,
      qrbox: { width: qrBoxSize, height: qrBoxSize },
    }, false);

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScan, onError]);

  return <div id="qr-reader" className={`w-full ${className}`} style={style} />;
};