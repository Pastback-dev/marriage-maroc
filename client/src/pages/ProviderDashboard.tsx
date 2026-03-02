// ... existing code ...

function PhotoGallery({ userId }: { userId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: photos, isLoading: photosLoading } = useQuery({
    queryKey: ["provider-photos", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_photos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('provider-photos')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('provider-photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('provider_photos')
        .insert({
          user_id: userId,
          image_url: publicUrl,
          description: null,
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-photos", userId] });
      toast({ title: "Photo uploaded successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    }
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: number) => {
      await supabase
        .from('provider_photos')
        .delete()
        .eq('id', photoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-photos", userId] });
      toast({ title: "Photo deleted" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhotoMutation.mutate(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" /> Photo Gallery
        </CardTitle>
        <CardDescription>Upload photos of your work to attract more clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            data-testid="input-photo-upload"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadPhotoMutation.isPending}
            className="w-full border-dashed"
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadPhotoMutation.isPending ? "Uploading..." : "Upload Photo"}
          </Button>
        </div>

        {photosLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading photos...</div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo: any) => (
              <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border">
                <img 
                  src={photo.image_url} 
                  alt="Provider work"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deletePhotoMutation.mutate(photo.id)}
                    disabled={deletePhotoMutation.isPending}
                    data-testid={`button-delete-photo-${photo.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No photos uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ... end of file ...