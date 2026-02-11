import { app, configureApp } from '@Config/app';
import { connectToDatabase } from '@Connection/dataBase';
import mainRouter from '@Routes/route';
import { errorMiddleware } from '@Middlewares/errorMiddleware';

configureApp();

connectToDatabase();

app.use(mainRouter());
app.use(errorMiddleware);

export default app;
