interface SpeedTestResult {
  downloadSpeed: number; // in Mbps
  uploadSpeed: number;   // in Mbps
  ping: number;         // in ms
}

export async function measureNetworkSpeed(): Promise<SpeedTestResult> {
  const startTime = performance.now();
  const testFileSize = 5 * 1024 * 1024; // 5MB test file
  const downloadUrl = 'https://cdn.jsdelivr.net/gh/librespeed/speedtest-go@master/example-singlethread-garbage.dat';
  
  try {
    // Measure ping
    const pingStart = performance.now();
    await fetch(downloadUrl, { method: 'HEAD' });
    const pingTime = performance.now() - pingStart;

    // Measure download speed
    const downloadStart = performance.now();
    const response = await fetch(downloadUrl);
    const reader = response.body?.getReader();
    let downloadedBytes = 0;

    if (!reader) {
      throw new Error('Failed to initialize download test');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      downloadedBytes += value.length;
    }

    const downloadTime = (performance.now() - downloadStart) / 1000; // Convert to seconds
    const downloadSpeed = (downloadedBytes * 8) / (1024 * 1024 * downloadTime); // Convert to Mbps

    // Measure upload speed using Beacon API
    const uploadData = new Blob([new ArrayBuffer(testFileSize)]);
    const uploadStart = performance.now();
    const uploadResult = await fetch('/api/speed-test/upload', {
      method: 'POST',
      body: uploadData,
    });

    const uploadTime = (performance.now() - uploadStart) / 1000;
    const uploadSpeed = (testFileSize * 8) / (1024 * 1024 * uploadTime);

    return {
      downloadSpeed: Math.round(downloadSpeed * 100) / 100,
      uploadSpeed: Math.round(uploadSpeed * 100) / 100,
      ping: Math.round(pingTime),
    };
  } catch (error) {
    console.error('Speed test failed:', error);
    throw error;
  }
} 