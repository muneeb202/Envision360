export default function Footer(props) {
    return (
        <div className="footer-basic" style={{marginTop:props.top}}>
            <footer>
                <div className="social">
                    <a href="#"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#"><i className="fa-brands fa-github"></i></a>
                    <a href="#"><i className="fa-brands fa-twitter"></i></a>
                    <a href="#"><i className="fa-brands fa-facebook"></i></a>
                </div>
                <ul className="list-inline">
                    <li className="list-inline-item"><a href="#">Home</a></li>
                    <li className="list-inline-item"><a href="#">Services</a></li>
                    <li className="list-inline-item"><a href="#">About</a></li>
                    <li className="list-inline-item"><a href="#">Terms</a></li>
                    <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
                </ul>
                <p className="copyright">Envision360 © 2023</p>
            </footer>
        </div>
    )
}