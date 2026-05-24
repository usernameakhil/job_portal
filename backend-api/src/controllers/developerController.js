const ServerUiConfig = require('../models/ServerUiConfig');

exports.pushSduiThemeEngine = async (req, res) => {
  try {
    const { portalKey, themeEngine, announcementTicker } = req.body;
    
    const uiConfig = await ServerUiConfig.findOneAndUpdate(
      { portalKey },
      { themeEngine, announcementTicker, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, updatedConfiguration: uiConfig });
  } catch (error) {
    return res.status(500).json({ error: 'SDUI update sequence faulted.', detail: error.message });
  }
};

exports.getSduiConfiguration = async (req, res) => {
  try {
    const { portalKey } = req.params;
    const configuration = await ServerUiConfig.findOne({ portalKey });
    if (!configuration) return res.status(404).json({ error: 'Configuration matrix absent.' });
    return res.status(200).json(configuration);
  } catch (err) {
    return res.status(500).json({ error: 'SDUI data transmission failed.' });
  }
};