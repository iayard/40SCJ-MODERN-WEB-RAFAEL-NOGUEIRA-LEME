import { CardComent, CardPost } from "./styles";
import imgProfile from "../../assets/profile.png"
import { useState } from "react";
import { getUser } from "../../services/security";
import { format } from "date-fns";
import { api } from "../../services/api";

function Post({ data }) {

    let signedUser = getUser();
    let idPostAnswer;

    console.log(data)

    const [showComents, setShowComents] = useState(false);

    const [newComment, setNewComent] = useState({
        coment: ""
    });

    const handleInput = (e) => {
        setNewComent({ ...newComment, [e.target.id]: e.target.value });
    }

    const [isLoading, setIsLoading] = useState(false);

    const toggleComents = () => setShowComents(!showComents);

    //função tentativa de envio
    const comentSubmit = async (text, e) => {
        if (text.length < 10) {
            return
        } else {
            idPostAnswer = text.id;
            console.log(newComment.coment);
            e.preventDefault();
    
            const data = {
                "description": newComment.coment
            };
            
            console.log(data);
            setIsLoading(true);
    
            try {
                await api.post(`/questions/${idPostAnswer}/answers`, data, {
                    headers: {
                        "Content-type": "application/json"
                    }
                });
                window.location.reload();
            } catch (error) {
                console.error(error);   
                alert(error);
            } finally{
                setIsLoading(false);
            }   
        }
    }

    return (
        <CardPost>
            <header>
                <img src={imgProfile} />
                <div>
                    <p>por {signedUser.studentId === data.Student.id ? "você" : data.Student.name}</p>
                    <span>em {format(new Date(data.created_at), "dd/MM/yyyy 'às' HH:mm")}</span>
                </div>
            </header>
            <main>
                <div>
                    <h2>{data.title}</h2>
                    <p>{data.description}</p>
                </div>
                {data.image && <img src={data.image} alt="imagem do post" />}
                <footer>
                    {data.Categories.map(c => <p>{c.description}</p>)}
                </footer>
            </main>
            <footer>
                <h3 onClick={toggleComents}>
                    {
                        data.Answers.length === 0 ?
                            "Seja o primeiro a comentar" :
                            `${data.Answers.length} Comentário${data.Answers.length > 1 && "s"}`
                    }
                </h3>
                {showComents && (
                    <>
                        {data.Answers.map(coment => <Coment coment={coment} />)}
                    </>
                )}
                <div>
                    {/* Linha abaixo alterada */}
                    <form onSubmit={(e) => comentSubmit(data, e)}>
                        <input
                            id="coment"
                            placeholder="Comente este post"
                            minLength="10"
                            required
                            value={newComment.coment}//desabilita botao
                            onChange={handleInput}//desabilita botao
                        />
                        <button disabled={newComment.coment.length<10}/* regra para desabilitar se menor que 10 caracteres */>Enviar</button>
                    </form>
                
                </div>
            </footer>
        </CardPost>
    );
}

function Coment({coment}) {

    return (
        <CardComent>
            <header>
                <img src={coment.Student.image} />
                <div>
                    <p>por {coment.Student.name}</p>
                    <span>em {coment.created_at}</span>
                </div>
            </header>
            <p>{coment.description}</p>
        </CardComent>
    );
}

export default Post;