import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface Preset {
  id: string;
  name: string;
  speed: number;
  direction: 'forward' | 'reverse';
  duration: number;
}

interface PresetManagerProps {
  presets: Preset[];
  onApplyPreset: (preset: Preset) => void;
  onAddPreset: (preset: Omit<Preset, 'id'>) => void;
  onDeletePreset: (id: string) => void;
  disabled?: boolean;
}

export const PresetManager = ({
  presets,
  onApplyPreset,
  onAddPreset,
  onDeletePreset,
  disabled = false
}: PresetManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPreset, setNewPreset] = useState({
    name: '',
    speed: 50,
    direction: 'forward' as 'forward' | 'reverse',
    duration: 30
  });

  const handleSavePreset = () => {
    if (!newPreset.name.trim()) {
      toast.error('Veuillez entrer un nom pour le preset');
      return;
    }

    onAddPreset(newPreset);
    setNewPreset({
      name: '',
      speed: 50,
      direction: 'forward',
      duration: 30
    });
    setIsDialogOpen(false);
    toast.success('Preset créé avec succès');
  };

  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-primary">Presets personnalisés</h2>

      <div className="flex gap-3">
        <Select
          onValueChange={(value) => {
            const preset = presets.find(p => p.id === value);
            if (preset) onApplyPreset(preset);
          }}
          disabled={disabled || presets.length === 0}
        >
          <SelectTrigger className="flex-1 bg-input border-border">
            <SelectValue placeholder="Sélectionner un preset" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {presets.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={disabled}
              className="bg-primary/10 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">Nouveau preset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="preset-name">Nom</Label>
                <Input
                  id="preset-name"
                  value={newPreset.name}
                  onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                  placeholder="Mon preset"
                  className="bg-input border-border"
                />
              </div>
              <div>
                <Label htmlFor="preset-speed">Vitesse (%)</Label>
                <Input
                  id="preset-speed"
                  type="number"
                  min={0}
                  max={100}
                  value={newPreset.speed}
                  onChange={(e) => setNewPreset({ ...newPreset, speed: Number(e.target.value) })}
                  className="bg-input border-border"
                />
              </div>
              <div>
                <Label htmlFor="preset-direction">Direction</Label>
                <Select
                  value={newPreset.direction}
                  onValueChange={(value: 'forward' | 'reverse') => 
                    setNewPreset({ ...newPreset, direction: value })
                  }
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="forward">Avancer</SelectItem>
                    <SelectItem value="reverse">Reculer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="preset-duration">Durée (secondes)</Label>
                <Input
                  id="preset-duration"
                  type="number"
                  min={1}
                  max={300}
                  value={newPreset.duration}
                  onChange={(e) => setNewPreset({ ...newPreset, duration: Number(e.target.value) })}
                  className="bg-input border-border"
                />
              </div>
              <Button onClick={handleSavePreset} className="w-full bg-primary text-primary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {presets.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex-1">
                <p className="font-semibold">{preset.name}</p>
                <p className="text-sm text-muted-foreground">
                  {preset.speed}% • {preset.direction === 'forward' ? 'Avancer' : 'Reculer'} • {preset.duration}s
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onDeletePreset(preset.id);
                  toast.info('Preset supprimé');
                }}
                disabled={disabled}
                className="text-destructive hover:bg-destructive/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
