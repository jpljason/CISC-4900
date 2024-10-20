import React, { useState, useEffect } from "react";
import "../styles/overview.css"

export default function Overview() {
  //Live clock displayed on the section
  function Clock() {
    const [time, setTime] = useState(new Date());
    
    useEffect(() => {
      const intervalId = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => clearInterval(intervalId);
    }, []);

    return (
      <div className="localTime">
        Current Time: <span className="time">{time.toLocaleTimeString()}</span>
      </div>
    );
  }
  return (
    <section className="overview-container" id="overview">
      <h1 className="overview-title">Overview<div className="horizontal-line"></div></h1>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas maximus mi nunc, in dapibus orci eleifend ac. Sed ipsum urna, porttitor quis magna vitae, ornare rhoncus est. Praesent et sapien porttitor, vulputate dui nec, accumsan ex. Curabitur gravida ipsum et sapien aliquet vehicula. Duis laoreet ullamcorper scelerisque. Nunc nec eros non erat eleifend molestie. Quisque sem lectus, porttitor at nisl eu, cursus posuere eros. Quisque pharetra varius sem vel auctor. Mauris imperdiet mauris at ultricies malesuada. Integer malesuada rhoncus nulla vitae sollicitudin. In sagittis ligula orci, a ultrices eros sollicitudin id. Vivamus ultrices laoreet velit. Fusce fringilla dui neque, quis tempus tellus convallis ut.

          Praesent non tellus diam. Nulla ut lacinia augue. Pellentesque ullamcorper in ex quis consequat. Integer pellentesque a sem id gravida. Morbi metus justo, ornare nec ipsum ut, elementum mattis orci. Cras sit amet lorem tempus, placerat elit sed, dapibus erat. Aenean ut enim libero. Donec a enim id metus laoreet tincidunt. Cras ac facilisis arcu. Ut metus leo, pharetra eget auctor sit amet, placerat eget metus. Donec aliquet ligula ut magna pretium, sit amet posuere dolor fermentum. Interdum et malesuada fames ac ante ipsum primis in faucibus.

          Pellentesque eget maximus lacus, eget ullamcorper turpis. Maecenas eu elementum magna, elementum suscipit est. Fusce vitae justo sem. Vestibulum id imperdiet nisl. Aliquam libero nisl, rhoncus et finibus ac, blandit sit amet nibh. Vestibulum ultrices porttitor justo, ut suscipit urna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;

          Fusce a porta justo, ut cursus erat. Donec at purus quis sem sagittis vehicula consequat et erat. Maecenas sodales suscipit tempus. Duis at leo vitae risus placerat faucibus. Sed nec lectus fermentum, cursus sapien vel, vehicula arcu. Praesent eu augue dolor. Sed arcu purus, mattis et sem sed, elementum dignissim justo.

          Vivamus condimentum ex nec mauris tempor, et pretium augue efficitur. Duis dignissim magna ut lacinia aliquet. Nulla tristique auctor iaculis. Donec auctor maximus rutrum. Maecenas sodales est rutrum finibus finibus. Nunc non orci a enim egestas tincidunt. Nunc ultrices libero vitae dui pretium, a feugiat nulla aliquam. Morbi cursus lacinia sapien ut posuere. Curabitur pharetra placerat velit. Suspendisse at eros est. Etiam quis felis ante. In commodo ornare lectus, id lobortis justo lobortis sed. Sed scelerisque leo nec leo suscipit lacinia. In condimentum, est eu semper porta, velit dui congue velit, et lobortis risus nisi a turpis. Aliquam erat volutpat.
          <Clock />
        </div>
    </section>
  )
}