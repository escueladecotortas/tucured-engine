// Archivo: frontend/src/components/tabs/sop/SopMarkdown.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MermaidRenderer } from './MermaidRenderer';

export function SopMarkdown({ content }) {
    return (
        <div className="text-sm font-light text-gray-300 leading-relaxed">
            <ReactMarkdown
                components={{
                    code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isMermaid = match && match[1] === 'mermaid';
                        
                        if (!inline && isMermaid) {
                            return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
                        }
                        
                        return !inline && match ? (
                            <div className="relative group my-4">
                                <div className="absolute -top-3 right-2 text-[10px] text-gray-500 bg-[#0f0f15] px-2 py-0.5 border border-white/10 rounded uppercase">
                                    {match[1]}
                                </div>
                                <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto border border-white/5 text-gray-300 font-mono text-xs">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            <code className={`${inline ? 'bg-white/10 px-1 py-0.5 rounded text-indigo-300 font-mono text-[11px]' : ''} ${className}`} {...props}>
                                {children}
                            </code>
                        )
                    },
                    h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 border-b border-indigo-500/30 pb-2">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-semibold text-indigo-400 mb-3 mt-6">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-medium text-white mb-2 mt-4">{children}</h3>,
                    ul: ({children}) => <ul className="list-disc list-outside ml-4 space-y-1 mb-4 text-gray-400">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-outside ml-4 space-y-1 mb-4 text-gray-400">{children}</ol>,
                    li: ({children}) => <li className="pl-1">{children}</li>,
                    a: ({href, children}) => (
                        <a 
                            href={href} 
                            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    blockquote: ({children}) => <blockquote className="border-l-2 border-indigo-500/50 pl-4 italic text-gray-500 my-4 bg-white/5 py-2 pr-2 rounded-r">{children}</blockquote>,
                    table: ({children}) => <div className="overflow-x-auto my-6 border border-white/5 rounded-lg"><table className="min-w-full text-left text-xs">{children}</table></div>,
                    thead: ({children}) => <thead className="bg-white/5 text-gray-200 uppercase tracking-wider">{children}</thead>,
                    th: ({children}) => <th className="px-4 py-3 font-medium border-b border-white/5">{children}</th>,
                    td: ({children}) => <td className="px-4 py-3 border-b border-white/5 text-gray-400">{children}</td>,
                    hr: () => <hr className="border-white/10 my-8" />
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
