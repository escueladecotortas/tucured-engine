// Archivo: frontend/src/components/core/ModalManager.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import { MissionReportModal } from '../modals/MissionReportModal';
import { FilePreviewModal } from '../modals/FilePreviewModal';

const FileExplorer = React.lazy(() => import('../FileExplorer'));
const AdminPanelModal = React.lazy(() => import('../AdminPanelModal'));
const ApprovalQueue = React.lazy(() => import('../ApprovalQueue'));

export default function ModalManager({
  showFileExplorer, showAdminPanel, showApprovals, showDeleteConfirm,
  selectedMissionReport, previewFile, previewContent, terminalLogs, logsEndRef,
  projectId, onCloseFileExplorer, onCloseAdminPanel,
  onCloseApprovals, onCloseDeleteConfirm, onConfirmDelete,
  onCloseMissionReport, onCloseFilePreview, onPreviewFile
}) {
  return (
    <>
      {showFileExplorer && (
        <React.Suspense fallback={null}>
          <FileExplorer projectId={projectId} onClose={onCloseFileExplorer} />
        </React.Suspense>
      )}

      {/* Se purgó el bloque obsoleto de AgentLab para sanear la compilación */}

      {showAdminPanel && (
        <React.Suspense fallback={null}>
          <AdminPanelModal onClose={onCloseAdminPanel} />
        </React.Suspense>
      )}

      <AnimatePresence>
        {showApprovals && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4" onClick={onCloseApprovals}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="w-full max-w-2xl h-[70vh]" onClick={e => e.stopPropagation()}>
              <ApprovalQueue onClose={onCloseApprovals} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal isOpen={!!showDeleteConfirm} onClose={onCloseDeleteConfirm} onConfirm={onConfirmDelete} />

      <MissionReportModal
        isOpen={!!selectedMissionReport}
        mission={selectedMissionReport}
        terminalLogs={terminalLogs}
        logsEndRef={logsEndRef}
        onClose={onCloseMissionReport}
        onPreviewFile={onPreviewFile}
      />

      <FilePreviewModal isOpen={!!previewFile} file={previewFile} content={previewContent} onClose={onCloseFilePreview} />
    </>
  );
}