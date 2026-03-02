app.get(api.providers.get.path, requireAuth, async (req, res) => {
    const provider = await storage.getProvider(Number(req.params.id));
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  });