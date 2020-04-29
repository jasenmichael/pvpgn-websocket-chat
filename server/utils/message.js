class Message {
  constructor(name, text, id, time) {
    this.name = name;
    this.text = text;
    this.id = id;
    // this.time = new Date().toString().slice(15, 24);
    this.time = time;
  }
}

module.exports = () => {
  return Message
}
