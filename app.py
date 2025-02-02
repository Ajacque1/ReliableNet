from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/speedtest', methods=['GET'])
def run_speed_test():
    # Return mock speed test data
    return jsonify({
        "download_speed": 120,  # Mock download speed in Mbps
        "upload_speed": 40,    # Mock upload speed in Mbps
        "ping": 15             # Mock ping in ms
    })

if __name__ == '__main__':
    app.run(debug=True)
