import Presentation from "components/Presentation";
import MainImg from "public/performance.jpg";

export default function Performance() {
  return (
    <Presentation
      imgData={MainImg}
      alt="Performance img"
      title="Some long title about performance"
    />
  );
}
