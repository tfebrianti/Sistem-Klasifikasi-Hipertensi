import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PredictionRecord, DoctorProfile } from '../types';
import { useFacilityStore, FacilityConfig } from '../stores/facilityStore';

interface ExportPdfOptions {
  records: PredictionRecord[];
  facility?: FacilityConfig;
  doctor?: DoctorProfile | null;
  filterKeyword?: string;
}

export function exportHistoryToPdf({
  records,
  facility: customFacility,
  doctor,
  filterKeyword,
}: ExportPdfOptions): void {
  // Use passed facility or fetch latest from facility store
  const facility = customFacility || useFacilityStore.getState().facility;

  // Initialize landscape A4 document (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;

  // 1. KOP SURAT FASILITAS KESEHATAN RESMI
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text((facility.pemerintahDaerah || 'PEMERINTAH KABUPATEN BANYUMAS').toUpperCase(), pageWidth / 2, 14, { align: 'center' });
  
  doc.setFontSize(13);
  doc.text((facility.dinasKesehatan || 'DINAS KESEHATAN KABUPATEN BANYUMAS').toUpperCase(), pageWidth / 2, 19, { align: 'center' });
  
  doc.setFontSize(15);
  doc.setTextColor(30, 58, 138); // Blue-900
  doc.text((facility.namaPuskesmas || 'PUSKESMAS I KEMBARAN').toUpperCase(), pageWidth / 2, 25, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(
    `${facility.alamat} | Telp: ${facility.telepon} | Email: ${facility.email}`,
    pageWidth / 2,
    30,
    { align: 'center' }
  );

  // Double horizontal separator line
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.8);
  doc.line(marginX, 33, pageWidth - marginX, 33);
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.2);
  doc.line(marginX, 34, pageWidth - marginX, 34);

  // 2. DOCUMENT TITLE & METADATA
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('LAPORAN REKAPITULASI HASIL SKRINING KLINIS HIPERTENSI', pageWidth / 2, 41, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.text(
    'Standar Diagnosis: JNC-7 (The Seventh Report of the Joint National Committee) | Algoritma: Machine Learning SMOTE',
    pageWidth / 2,
    46,
    { align: 'center' }
  );

  // Date & summary line
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // 3. STATISTICAL SUMMARY CHIPS
  const totalCount = records.length;
  const normalCount = records.filter((r) => r.result === 'Normal').length;
  const preCount = records.filter((r) => r.result === 'Pra Hipertensi').length;
  const t1Count = records.filter((r) => r.result === 'Tingkat 1').length;
  const t2Count = records.filter((r) => r.result === 'Tingkat 2').length;

  const cardY = 51;
  const cardHeight = 12;
  const cardSpacing = 4;
  const totalCards = 5;
  const usableWidth = pageWidth - marginX * 2;
  const cardWidth = (usableWidth - cardSpacing * (totalCards - 1)) / totalCards;

  const summaryData = [
    { label: 'Total Pemeriksaan', val: `${totalCount} Pasien`, color: [241, 245, 249], textCol: [30, 41, 59] },
    { label: 'Normal', val: `${normalCount} (${totalCount ? Math.round((normalCount / totalCount) * 100) : 0}%)`, color: [236, 253, 245], textCol: [5, 150, 105] },
    { label: 'Pra Hipertensi', val: `${preCount} (${totalCount ? Math.round((preCount / totalCount) * 100) : 0}%)`, color: [254, 252, 232], textCol: [202, 138, 4] },
    { label: 'Tingkat 1 (Ringan/Sedang)', val: `${t1Count} (${totalCount ? Math.round((t1Count / totalCount) * 100) : 0}%)`, color: [255, 247, 237], textCol: [234, 88, 12] },
    { label: 'Tingkat 2 (Berat)', val: `${t2Count} (${totalCount ? Math.round((t2Count / totalCount) * 100) : 0}%)`, color: [254, 242, 242], textCol: [220, 38, 38] },
  ];

  summaryData.forEach((card, idx) => {
    const x = marginX + idx * (cardWidth + cardSpacing);
    doc.setFillColor(card.color[0], card.color[1], card.color[2]);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(card.label, x + cardWidth / 2, cardY + 4.2, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(card.textCol[0], card.textCol[1], card.textCol[2]);
    doc.text(card.val, x + cardWidth / 2, cardY + 9.5, { align: 'center' });
  });

  // 4. DATA TABLE SETUP
  const tableData = records.map((r, index) => {
    const pulsePressure = r.systolic - r.diastolic;
    const ppWarning = pulsePressure > 50 ? ' (!)' : '';
    return [
      (index + 1).toString(),
      r.id,
      r.date.slice(0, 10),
      r.patientId,
      r.patientName,
      r.gender === 'L' ? 'L' : 'P',
      `${r.age} th`,
      r.bmi.toFixed(1),
      `${r.systolic} / ${r.diastolic}`,
      `${pulsePressure}${ppWarning}`,
      r.result,
      `${Math.round(r.confidenceScore)}%`,
    ];
  });

  autoTable(doc, {
    startY: cardY + cardHeight + 4,
    head: [
      [
        'No',
        'ID Rekam',
        'Tgl Periksa',
        'ID Pasien',
        'Nama Pasien',
        'L/P',
        'Usia',
        'IMT',
        'TD (mmHg)',
        'PP (mmHg)',
        'Klasifikasi (JNC-7)',
        'Skor AI',
      ],
    ],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [30, 58, 138], // Navy Blue
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 22 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'left', cellWidth: 46 },
      5: { halign: 'center', cellWidth: 10 },
      6: { halign: 'center', cellWidth: 14 },
      7: { halign: 'center', cellWidth: 16 },
      8: { halign: 'center', cellWidth: 24, fontStyle: 'bold' },
      9: { halign: 'center', cellWidth: 22 },
      10: { halign: 'center', cellWidth: 38, fontStyle: 'bold' },
      11: { halign: 'center', cellWidth: 18 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: (data) => {
      // Highlight clinical diagnosis column
      if (data.section === 'body' && data.column.index === 10) {
        const val = data.cell.raw as string;
        if (val === 'Normal') {
          data.cell.styles.textColor = [5, 150, 105]; // emerald
          data.cell.styles.fillColor = [236, 253, 245];
        } else if (val === 'Pra Hipertensi') {
          data.cell.styles.textColor = [202, 138, 4]; // amber
          data.cell.styles.fillColor = [254, 252, 232];
        } else if (val === 'Tingkat 1') {
          data.cell.styles.textColor = [234, 88, 12]; // orange
          data.cell.styles.fillColor = [255, 247, 237];
        } else if (val === 'Tingkat 2') {
          data.cell.styles.textColor = [220, 38, 38]; // rose
          data.cell.styles.fillColor = [254, 242, 242];
        }
      }
      // Pulse pressure alert
      if (data.section === 'body' && data.column.index === 9) {
        const val = data.cell.raw as string;
        if (val.includes('(!)')) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    margin: { left: marginX, right: marginX, bottom: 35 },
  });

  // 5. SIGNATURE & VALIDATION FOOTER
  // @ts-ignore - lastAutoTable is injected by jspdf-autotable
  const finalY = (doc as any).lastAutoTable?.finalY || 140;
  
  // Check if we need to add a new page for signature to prevent overflowing off bottom
  let sigY = finalY + 10;
  if (sigY + 30 > pageHeight) {
    doc.addPage();
    sigY = 20;
  }

  const doctorName = facility.namaDokter || doctor?.name || 'dr. Triana Wulandari, S.Ked';
  const doctorSpecialty = facility.spesialisasiDokter || doctor?.specialty || 'Dokter Penanggung Jawab Klinis';
  const doctorSip = facility.sipDokter || '503/446/SIP.D/2024';
  const kotaPengesahan = facility.kotaPengesahan || 'Banyumas';

  const sigX = pageWidth - marginX - 70;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`${kotaPengesahan}, ${dateFormatted}`, sigX, sigY, { align: 'left' });
  doc.text(doctorSpecialty, sigX, sigY + 5, { align: 'left' });

  // Signature line
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(doctorName, sigX, sigY + 24, { align: 'left' });
  doc.setLineWidth(0.3);
  doc.setDrawColor(100, 116, 139);
  doc.line(sigX, sigY + 25.5, sigX + 65, sigY + 25.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`SIP: ${doctorSip}`, sigX, sigY + 29.5, { align: 'left' });

  // 6. PAGE NUMBERING & WATERMARK FOOTER ON ALL PAGES
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - 8, pageWidth - marginX, pageHeight - 8);

    doc.text(
      `Dokumen Resmi Rekapitulasi Skrining Hipertensi — ${facility.namaPuskesmas} — Dicetak pada: ${dateFormatted} pukul ${timeFormatted} WIB ${
        filterKeyword ? `(Filter: "${filterKeyword}")` : ''
      }`,
      marginX,
      pageHeight - 4.5
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginX, pageHeight - 4.5, {
      align: 'right',
    });
  }

  // Trigger browser download
  const cleanName = (facility.namaPuskesmas || 'Puskesmas_1_Kembaran').replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = now.toISOString().slice(0, 10);
  doc.save(`Laporan_Skrining_Hipertensi_${cleanName}_${dateStr}.pdf`);
}
