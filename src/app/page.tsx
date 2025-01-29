import Presentation from "components/Presentation";
import HomePageImg from "public/bg-img.jpg";

export default function Home() {
  return (
    <Presentation
      imgData={HomePageImg}
      alt="Home page img"
      title="Some long title"
    />
  );
}
