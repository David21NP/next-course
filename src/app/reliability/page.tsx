import Presentation from "components/Presentation";
import MainImg from "public/reliability.jpg";

export default function Reliability() {
  return (
    <Presentation
      imgData={MainImg}
      alt="Reliability img"
      title="Some long title about reliability"
    />
  );
}
