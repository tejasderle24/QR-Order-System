import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import DashboardLayout from "@/layouts/DashboardLayout";

const QRCodesPage = () => {
    const [tableId, setTableId] = useState("");
    const [generated, setGenerated] = useState(null);

    const handleGenerate = () => {
        if (!tableId) return alert("Enter table ID");
        // Example frontend URL (change to your deploy URL later)
        const url = `${window.location.origin}/?tableId=${tableId}`;
        setGenerated(url);
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-xl font-bold mb-4">Generate Table QR Code</h1>

                <div className="flex gap-2 mb-4">
                    <input
                        className="border p-2"
                        placeholder="Enter Table ID (e.g. T1)"
                        value={tableId}
                        onChange={(e) => setTableId(e.target.value)}
                    />
                    <button
                        onClick={handleGenerate}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Generate QR
                    </button>
                </div>

                {generated && (
                    <div className="mt-6 text-center">
                        <h2 className="text-lg font-semibold mb-2">📌 Table ID: {tableId}</h2>
                        <QRCodeCanvas value={generated} size={200} />
                        <p className="mt-2 break-all">{generated}</p>
                        <button
                            onClick={() => window.print()}
                            className="mt-4 bg-blue-600 text-white px-3 py-1 rounded"
                        >
                            Print QR
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default QRCodesPage;
