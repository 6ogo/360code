
import React from 'react';
import { cn } from '@/lib/utils';

const CodeSnippet: React.FC = () => {
  const codeLines = [
    { 
      content: "// 360code.io assists with complex React components", 
      color: "text-muted-foreground", 
      indent: 0 
    },
    { 
      content: "import React, { useState, useEffect } from 'react';", 
      color: "text-code-purple", 
      indent: 0 
    },
    { content: "", color: "", indent: 0 },
    { 
      content: "// AI suggested optimization for data fetching", 
      color: "text-muted-foreground", 
      indent: 0 
    },
    { 
      content: "const DataVisualizer = ({ endpoint, config }) => {", 
      color: "text-code-blue", 
      indent: 0 
    },
    { 
      content: "const [data, setData] = useState(null);", 
      color: "text-foreground", 
      indent: 1 
    },
    { 
      content: "const [loading, setLoading] = useState(true);", 
      color: "text-foreground", 
      indent: 1 
    },
    { 
      content: "const [error, setError] = useState(null);", 
      color: "text-foreground", 
      indent: 1 
    },
    { content: "", color: "", indent: 0 },
    { 
      content: "useEffect(() => {", 
      color: "text-code-blue", 
      indent: 1 
    },
    { 
      content: "// 360code.io optimized fetching logic", 
      color: "text-muted-foreground", 
      indent: 2 
    },
    { 
      content: "const fetchData = async () => {", 
      color: "text-code-green", 
      indent: 2 
    },
    { 
      content: "try {", 
      color: "text-foreground", 
      indent: 3 
    },
    { 
      content: "const response = await fetch(endpoint);", 
      color: "text-foreground", 
      indent: 4 
    },
    { 
      content: "if (!response.ok) throw new Error('Network error');", 
      color: "text-foreground", 
      indent: 4 
    },
    { 
      content: "const result = await response.json();", 
      color: "text-foreground", 
      indent: 4 
    },
    { 
      content: "setData(transformData(result, config));", 
      color: "text-code-blue", 
      indent: 4 
    },
    { 
      content: "} catch (err) {", 
      color: "text-foreground", 
      indent: 3 
    },
    { 
      content: "setError(err.message);", 
      color: "text-foreground", 
      indent: 4 
    },
    { 
      content: "console.error('Failed to fetch data:', err);", 
      color: "text-foreground", 
      indent: 4 
    },
    { 
      content: "} finally {", 
      color: "text-foreground", 
      indent: 3 
    },
    { 
      content: "setLoading(false);", 
      color: "text-foreground", 
      indent: 4 
    },
    { 
      content: "}", 
      color: "text-foreground", 
      indent: 2 
    },
    { 
      content: "};", 
      color: "text-foreground", 
      indent: 2 
    },
    { content: "", color: "", indent: 0 },
    { 
      content: "fetchData();", 
      color: "text-foreground", 
      indent: 2 
    },
    { 
      content: "}, [endpoint, config]);", 
      color: "text-code-blue", 
      indent: 1 
    },
    { content: "", color: "", indent: 0 },
    { 
      content: "// Helper function to optimize data structure", 
      color: "text-muted-foreground", 
      indent: 1 
    },
    { 
      content: "const transformData = (rawData, config) => {", 
      color: "text-code-green", 
      indent: 1 
    },
    { 
      content: "// 360code.io suggested performance improvement", 
      color: "text-muted-foreground", 
      indent: 2 
    },
    { 
      content: "return config.optimize ? rawData.filter(item => item.value > config.threshold) : rawData;", 
      color: "text-foreground", 
      indent: 2 
    },
    { 
      content: "};", 
      color: "text-foreground", 
      indent: 1 
    },
    { content: "", color: "", indent: 0 },
    { 
      content: "return /* Component rendering with responsive design */;", 
      color: "text-muted-foreground", 
      indent: 1 
    },
    { 
      content: "};", 
      color: "text-foreground", 
      indent: 0 
    },
    { content: "", color: "", indent: 0 },
    { 
      content: "export default DataVisualizer;", 
      color: "text-code-purple", 
      indent: 0 
    },
  ];

  return (
    <div className="font-mono text-sm leading-relaxed">
      {codeLines.map((line, index) => (
        <div 
          key={index}
          className={cn(
            "codeblock-line",
            line.content ? "" : "h-4",
            line.color
          )}
          style={{ 
            paddingLeft: `${line.indent * 1}rem`,
            "--index": index
          } as React.CSSProperties}
        >
          {line.content}
        </div>
      ))}
    </div>
  );
};

export default CodeSnippet;
