import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Camera, 
  X, 
  AlertTriangle, 
  CheckCircle2,
  Loader2,
  Leaf,
  Info
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  disease: string;
  confidence: number;
  cause: string;
  prevention: string[];
  severity?: "low" | "medium" | "high" | "none";
  additionalInfo?: string;
}

const DiseaseUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        "analyze-crop-disease",
        {
          body: { imageBase64: image },
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Detected: ${data.disease}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze image";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/20 text-destructive";
      case "medium":
        return "bg-orange-500/20 text-orange-600";
      case "low":
        return "bg-yellow-500/20 text-yellow-600";
      case "none":
        return "bg-forest/20 text-forest";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const isHealthy = result?.disease?.toLowerCase().includes("healthy") || result?.severity === "none";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <Camera className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">AI Disease Detection</h3>
          <p className="text-sm text-muted-foreground">Upload a crop image for instant AI analysis</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              JPG, PNG, WebP up to 10MB
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <img
                src={image}
                alt="Uploaded crop"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                {error}
              </div>
            )}

            {!result && !error && (
              <Button 
                onClick={handleAnalyze} 
                variant="hero" 
                className="w-full"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Leaf className="w-4 h-4" />
                    Analyze Image
                  </>
                )}
              </Button>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Disease Result */}
                <div className={`rounded-xl p-4 ${isHealthy ? 'bg-forest/10' : 'bg-destructive/10'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isHealthy ? (
                        <CheckCircle2 className="w-5 h-5 text-forest" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      )}
                      <span className={`font-semibold ${isHealthy ? 'text-forest' : 'text-destructive'}`}>
                        {result.disease}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {result.severity && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityColor(result.severity)}`}>
                          {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                        </span>
                      )}
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${isHealthy ? 'bg-forest/20 text-forest' : 'bg-destructive/20 text-destructive'}`}>
                        {result.confidence}% confident
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.cause}</p>
                </div>

                {/* Prevention */}
                <div className="bg-forest/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-forest" />
                    <span className="font-semibold text-forest">
                      {isHealthy ? 'Care Tips' : 'Prevention & Treatment'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {result.prevention.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Info */}
                {result.additionalInfo && (
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Additional Information</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.additionalInfo}</p>
                  </div>
                )}

                <Button onClick={clearImage} variant="outline" className="w-full">
                  Analyze Another Image
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DiseaseUpload;
