// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import Voice from '@react-native-voice/voice';

// const App = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [recognizedText, setRecognizedText] = useState('');

//   useEffect(() => {
//     // Set up voice recognition
//     Voice.onSpeechStart = onSpeechStart;
//     Voice.onSpeechRecognized = onSpeechRecognized;
//     Voice.onSpeechResults = onSpeechResults;
//     Voice.onSpeechError = onSpeechError;

//     return () => {
//       // Clean up voice recognition listeners
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const onSpeechStart = () => {
//     setIsListening(true);
//   };

//   const onSpeechRecognized = (event: { error: any; }) => {
//     const { error } = event;
//     if (error) {
//       console.log('Speech recognition error: ', error);
//     }
//   };

//   // const onSpeechResults = (event: { value: any; }) => {
//   //   const { value } = event;
//   //   if (value && value.length > 0) {
//   //     setRecognizedText(value[0]);
//   //   }
//   // };

//   const onSpeechResults = (event: { value: any; }) => {
//     const { value } = event;
//     if (value && value.length > 0) {
//       const recognizedText = value[0];
//       setRecognizedText(recognizedText);
//       console.warn('Recognized Text:', recognizedText);
//     }
//   };
  
  

//   const onSpeechError = (event: { error: any; }) => {
//     console.log('Speech recognition error: ', event.error);
//   };

//   const startListening = async () => {
//     console.warn('listening started')
//     try {
//       await Voice.start('en-US');
//       setIsListening(true);
//       console.log('isListening:', isListenings);
//       // console.warn(setIsListening)
//     } catch (error) {
//       console.log('Error starting voice recognition: ', error);
//     }
//   };


//   const stopListening = async () => {
//     console.warn('listening stoped')
//     try {
//       await Voice.stop();
//       setIsListening(false);
//     } catch (error) {
//       console.log('Error stopping voice recognition: ', error);
//     }
//   };


  
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <TouchableOpacity onPress={startListening} style={{ padding: 10 }}>
//         <Text style={{ fontSize: 24 }}>Start Listening</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={stopListening} style={{ padding: 10, marginTop: 20 }}>
//         <Text style={{ fontSize: 24 }}>Stop Listening</Text>
//       </TouchableOpacity>
//       <Text style={{ marginTop: 20, fontSize: 18 }}>
//         Recognized Text: {recognizedText}
//       </Text>
//     </View>
//   );
// };

// export default App;


import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Voice from '@react-native-voice/voice';
import axios from 'axios';

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    // Set up voice recognition
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Clean up voice recognition listeners
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
    console.warn('Started listening');
  };

  const onSpeechPartialResults = (event: { value: any; }) => {
    const { value } = event;
    if (value && value.length > 0) {
      setRecognizedText(value[0]);
      console.warn('Recognized Text:', value[0]);
    }
  };

  const onSpeechEnd = () => {
    setIsListening(false);
    console.warn('Stopped listening');
    sendRecognizedText();
  };

  const onSpeechError = (event: { error: any; }) => {
    console.warn('Speech recognition error:', event.error);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.warn('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.warn('Error stopping voice recognition:', error);
    }
  };

  const sendRecognizedText = () => {

    const apiUrl = 'https://23cc-103-49-166-213.ngrok-free.app/human_disease_detection';

    const payload = {
      recognized_text: recognizedText,
    };

    axios
      .post(apiUrl, payload)
      .then((response) => {
   
        console.warn('API Response:', response.data);
        setResponseText(response.data);
      })
      .catch((error) => {
        console.warn('API Error:', error);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={startListening} style={{ padding: 10 }}>
        <Text style={{ fontSize: 24 }}>Start Listening</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stopListening} style={{ padding: 10, marginTop: 20 }}>
        <Text style={{ fontSize: 24 }}>Stop Listening</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 20, fontSize: 18 }}>
        Recognized Text: {recognizedText}
      </Text>
      <Text style={{ marginTop: 20, fontSize: 18 }}>
        API Response: {responseText}
      </Text>
    </View>
  );
};

export default App;
