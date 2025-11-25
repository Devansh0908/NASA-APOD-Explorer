const apodService = require('../services/apodService');

class APODController {
  async getToday(req, res) {
    try {
      const hd = req.query.hd === 'true';
      const apod = await apodService.getTodayAPOD(hd);
      res.json(apod);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getByDate(req, res) {
    try {
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({
          error: 'Date parameter is required'
        });
      }

      const apod = await apodService.getAPODByDate(date);
      res.json(apod);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getRecent(req, res) {
    try {
      const days = req.query.days;
      const apods = await apodService.getRecentAPODs(days);
      res.json(apods);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  handleError(res, error) {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    
    res.status(status).json({
      error: message
    });
  }
}

module.exports = new APODController();
