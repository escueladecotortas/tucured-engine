// Archivo: backend/services/CodiAstService.js
// SERVICE: CodiAstService v5.0 (Modularized - Ley de 200 líneas)
// Agente especializado en disección de sistemas React TSX mediante AST.

const fs = require('fs');
const path = require('path');
const { Project, SyntaxKind, Node } = require('ts-morph');
const AstUtils = require('./ast/AstUtils');
const AstComponentExtractor = require('./ast/AstComponentExtractor');

class CodiAstService {
    constructor() {
        this.project = new Project({ skipAddingFilesFromTsConfig: true });
        this.MAX_LINES = 200;
    }

    /**
     * Aplica la partición AST recursivamente si un archivo supera el límite de líneas.
     */
    async enforceFileLimit(filePath) {
        if (!fs.existsSync(filePath)) return false;
        const sourceFile = this.project.addSourceFileAtPath(filePath);
        const lineCount = sourceFile.getFullText().split('\n').length;
        
        if (lineCount <= this.MAX_LINES) return false;

        console.log(`⚠️ [CodiAST] Refactorización en ${path.basename(filePath)} (${lineCount} lins).`);

        // Identificar el componente funcional principal (Function o Arrow)
        let main = sourceFile.getFunctions()[0] || sourceFile.getVariableDeclarations().find(d => Node.isArrowFunction(d.getInitializer()))?.getInitializer();
        if (!main) return false;

        const returnStmt = main.getDescendantsOfKind(SyntaxKind.ReturnStatement)[0];
        if (!returnStmt) return false;

        const children = AstUtils.getJsxChildren(returnStmt.getExpression());
        
        // Estrategia Greedy: Buscar el hijo más grande (> 50 líneas)
        let best = null, maxL = 0;
        for (const child of children) {
             const l = child.getFullText().split('\n').length;
             if (l > 50 && l > maxL) { best = child; maxL = l; }
        }

        let newFilePath = null;
        if (best) {
             newFilePath = await AstComponentExtractor.extractSingle(sourceFile, best, filePath);
        } else if (children.length > 1) {
             console.log("  -> [CodiAST] Fragmentación táctica (Grouped Chunking)...");
             newFilePath = await AstComponentExtractor.extractGroup(sourceFile, children.slice(0, Math.floor(children.length/2)), filePath);
        }

        if (newFilePath) return await this._recursiveVerification(newFilePath, filePath);
        return false;
    }

    async _recursiveVerification(newPath, oldPath) {
        // Verificar hijo extraído
        if (fs.readFileSync(newPath, 'utf8').split('\n').length > this.MAX_LINES) {
             await this.enforceFileLimit(newPath);
        }
        // Verificar padre modificado
        if (fs.readFileSync(oldPath, 'utf8').split('\n').length > this.MAX_LINES) {
            await this.enforceFileLimit(oldPath);
        }
        return true;
    }
}

module.exports = CodiAstService;
