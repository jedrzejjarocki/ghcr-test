const ping = (req, res) => {
  res.json({
    status: 'OK',
    timestamp: (new Date).toISOString(),
  })
}

module.exports = {
  ping
}
