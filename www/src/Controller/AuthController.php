<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{
    /**
     * @Route("/login", methods={"GET"}, name="auth")
     */
    public function auth(): Response
    {
        return $this->render('login.html.twig');
    }

    /**
     * @Route("/login", methods={"POST"}, name="login")
     */
    public function login(Request $request, ValidatorInterface $validator): Response
    {
        $requestParameters = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail('example@test.loc');
        $user->setUserName($requestParameters['userName']);
        $user->setPassword($requestParameters['password']);

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            $messages = [];

            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }

            return $this->json([
                'messages' => $messages
            ], 400);
        }

        return $this->json([
            'message' => 'User has successfully logged in'
        ]);
    }

    /**
     * @Route("/register", methods={"POST"}, name="register")
     */
    public function register(Request $request, ValidatorInterface $validator): Response
    {
        $requestParameters = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($requestParameters['email']);
        $user->setUserName($requestParameters['userName']);
        $user->setPassword($requestParameters['password']);

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            $messages = [];

            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }

            return $this->json([
                'messages' => $messages
            ], 400);
        }

        return $this->json([
            'message' => 'User has been registered'
        ]);
    }
}
