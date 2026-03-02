// ... existing imports ...

function PhotoGallery({ userId }: { userId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);

  const { data: photos, isLoading } = useQuery({
    queryKey: ["provider-photos", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_photos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const MAX_PHOTOS = 5;
  const currentPhotoCount = photos?.length || 0;
  const canUploadMore = currentPhotoCount < MAX_PHOTOS;
  const remainingSlots = MAX_PHOTOS - currentPhotoCount;

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (previews.length === 0) return;
      
      // Check if upload would exceed limit
      if (currentPhotoCount + previews.length > MAX_PHOTOS) {
        throw new Error(`Cannot upload ${previews.length} photos. You can only upload up to ${remainingSlots} more photos.`);
      }
      
      setIsUploading(true);

      for (const preview of previews) {
        const fileExt = preview.file.name.split('.').pop();
        const fileName = `${userId}/${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolios')
          .upload(fileName, preview.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolios')
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('provider_photos')
          .insert({
            user_id: userId,
            image_url: publicUrl,
            description: null
          });

        if (dbError) throw dbError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-photos", userId] });
      toast({ title: `${previews.length} photo(s) uploaded successfully` });
      setPreviews([]);
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
      setIsUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (photo: any) => {
      const path = photo.image_url.split('/portfolios/')[1];
      await supabase.storage.from('portfolios').remove([path]);
      await supabase.from('provider_photos').delete().eq('id', photo.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-photos", userId] });
      toast({ title: "Photo deleted" });
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Check if upload would exceed limit
      if (currentPhotoCount + files.length > MAX_PHOTOS) {
        toast({
          variant: "destructive",
          title: "Upload limit exceeded",
          description: `You can only upload up to ${remainingSlots} more photos. Maximum ${MAX_PHOTOS} photos allowed.`
        });
        return;
      }
      
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-primary" /> Portfolio Gallery</CardTitle>
        <CardDescription>
          Upload photos of your work. Maximum {MAX_PHOTOS} photos allowed. 
          {canUploadMore ? ` You can upload ${remainingSlots} more photos.` : " Your portfolio is full."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          onChange={handleFileSelect} 
          accept="image/*" 
          multiple 
          disabled={!canUploadMore}
        />
        
        {previews.length > 0 && (
          <div className="mb-8 p-6 border-2 border-dashed rounded-2xl bg-primary/5">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
              {previews.map((p, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                  <img src={p.url} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setPreviews(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => uploadMutation.mutate()} disabled={isUploading} className="bg-primary hover:bg-primary/90">
                {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 w-4 h-4" />} 
                Upload {previews.length} Photo(s)
              </Button>
              <Button variant="outline" onClick={() => setPreviews([])}>Clear All</Button>
            </div>
          </div>
        )}

        {canUploadMore ? (
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-full mb-8 p-12 border-2 border-dashed rounded-2xl hover:bg-primary/5 hover:border-primary/30 transition-all group"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
              <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-lg font-bold text-secondary">Add Portfolio Photos</p>
            <p className="text-sm text-muted-foreground">Click to select one or many pictures</p>
            <p className="text-xs text-primary font-semibold mt-2">Up to {remainingSlots} more photos allowed</p>
          </button>
        ) : (
          <div className="w-full mb-8 p-12 border-2 border-dashed rounded-2xl bg-muted/20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-secondary">Portfolio Full</p>
            <p className="text-sm text-muted-foreground">Maximum {MAX_PHOTOS} photos reached</p>
            <p className="text-xs text-muted-foreground mt-2">Delete existing photos to upload new ones</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
        ) : photos?.length === 0 ? (
          <div className="text-center py-12 border rounded-2xl bg-slate-50/50">
            <p className="text-muted-foreground">Your gallery is empty. Upload your first photos above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos?.map((photo) => (
              <div key={photo.id} className="group relative rounded-2xl overflow-hidden border shadow-sm aspect-square">
                <img src={photo.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => { if(confirm("Delete this photo?")) deleteMutation.mutate(photo); }}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ... rest of the file remains unchanged ...