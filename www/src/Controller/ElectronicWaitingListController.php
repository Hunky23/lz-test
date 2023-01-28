<?php

namespace App\Controller;

use App\Entity\Person;
use App\Repository\PersonRepository;
use Doctrine\Persistence\ManagerRegistry;
use Dompdf\Dompdf;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ElectronicWaitingListController extends AbstractController
{
    /**
     * @Route("/person", methods={"POST"}, name="person")
     */
    public function person(Request $request, ValidatorInterface $validator, ManagerRegistry $doctrine): Response
    {
        $requestParameters = json_decode($request->getContent(), true);

        $person = new Person();
        $person->setName($requestParameters['name']);
        $person->setSurname($requestParameters['surname']);
        $person->setCreateAt(new \DateTimeImmutable('now'));

        $errors = $validator->validate($person);

        if (count($errors) > 0) {
            $messages = [];

            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }

            return $this->json([
                'messages' => $messages
            ], 400);
        }

        $entityManager = $doctrine->getManager();

        $entityManager->persist($person);

        $entityManager->flush();

        return $this->json([
            'message' => 'Person has been successfully added to wait list'
        ]);
    }

    /**
     * @Route("/list", name="list")
     */
    public function list(PersonRepository $personRepository): Response
    {
        $persons = $personRepository->findBy([], [
            'create_at' => 'ASC'
        ]);

        $html = $this->renderView('pdf.html.twig', [
            'persons' => $persons
        ]);

        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->render();

        return new Response (
            $dompdf->stream('resume', ["Attachment" => false]),
            Response::HTTP_OK,
            ['Content-Type' => 'application/pdf']
        );
    }
}
