import React, { useState } from 'react';
import SwaggerProcesser from '@super-trans/trans-swagger';

const transSwagger = new SwaggerProcesser({});

interface PlaygroundState {
  input: string;
  output: string;
  selectedTrans: 'swagger' | 'ts2md';
}

const App: React.FC = () => {
  const [state, setState] = useState<PlaygroundState>({
    input: '',
    output: '',
    selectedTrans: 'swagger'
  });
  const handleConvert = async () => {
    try {
      const result = await transSwagger.runByContent(state.input);
      setState(prev => ({ ...prev, output: result?.results || '' }));
    } catch (e) {
      setState(prev => ({ ...prev, output: `转换失败: ${(e as Error).message}` }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setState(prev => ({ ...prev, input: event.target?.result as string }));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Super Trans Playground</h1>

      <div className="mb-4">
        <label className="mr-2">选择转换器:</label>
        <select
          value={state.selectedTrans}
          onChange={(e) => setState(prev => ({ ...prev, selectedTrans: e.target.value as any }))}
          className="p-1 border rounded"
        >
          <option value="swagger">Swagger转表单/表格</option>
          <option value="ts2md">TS声明转Markdown</option>
        </select>
      </div>

      <input
        type="file"
        onChange={handleFileUpload}
        className="mb-4"
        accept=".json,.ts"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg mb-2">输入内容</h3>
          <textarea
            value={state.input}
            onChange={(e) => setState(prev => ({ ...prev, input: e.target.value }))}
            className="w-full h-64 p-2 border rounded"
            placeholder="输入Swagger JSON或TS代码..."
          />
        </div>

        <div>
          <h3 className="text-lg mb-2">转换结果</h3>
          <button
            onClick={handleConvert}
            className="mb-2 p-2 bg-blue-500 text-white rounded"
          >
            立即转换
          </button>
          <pre className="w-full h-64 p-2 border rounded bg-gray-100 overflow-auto">
            {state.output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;