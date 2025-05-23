// components/Loader.jsx
export default function Loader() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="standard-loader" />
      
      <style jsx>{`
        .standard-loader {
          width: 60px;
          height: 60px;
          border: 6px solid transparent;
          border-top: 6px solid #416CB4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}