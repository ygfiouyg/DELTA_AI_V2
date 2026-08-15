'use client';

import { useEffect, useState } from 'react';

interface Model {
  id: string;
  name: string;
  provider?: string;
  context_length?: number;
  description?: string;
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/draix/models');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.models || data.data || data.options || []);
        setModels(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectModel = async (modelId: string) => {
    setSelected(modelId);
    try {
      await fetch('/api/draix/model/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelId }),
      });
    } catch (e) {}
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">🤖 Models</h1>
        <p className="text-draix-muted">Select and configure AI models</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-32 rounded-xl bg-draix-hover-light dark:bg-draix-hover-dark animate-pulse"></div>
          ))}
        </div>
      ) : models.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => selectModel(model.id)}
              className={`draix-card cursor-pointer transition-all ${selected === model.id ? 'border-draix-gold ring-2 ring-draix-gold/20' : 'hover:border-draix-gold'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold">{model.name || model.id}</h3>
                {selected === model.id && <span className="text-draix-gold">✓</span>}
              </div>
              {model.provider && <p className="text-xs text-draix-muted mb-2">Provider: {model.provider}</p>}
              {model.context_length && <p className="text-xs text-draix-muted">Context: {(model.context_length / 1000).toFixed(0)}K tokens</p>}
              {model.description && <p className="text-xs mt-2 line-clamp-2">{model.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🤖</div>
          <p className="text-draix-muted">No models available</p>
          <p className="text-xs text-draix-muted mt-2">Check if Hermes is running on port 8000</p>
        </div>
      )}
    </div>
  );
}
