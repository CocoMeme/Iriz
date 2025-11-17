export async function detectSignboard(imageUri) {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  console.log('Sending request to:', `${process.env.EXPO_PUBLIC_API_URL}/api/detect-signboard`);
  
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/detect-signboard`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('Response status:', response.status);
  const text = await response.text();
  console.log('Response text:', text.substring(0, 200));
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, body: ${text.substring(0, 100)}`);
  }
  
  return JSON.parse(text);
}